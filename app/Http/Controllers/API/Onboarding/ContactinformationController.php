<?php

namespace App\Http\Controllers\API\Onboarding;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attachment;
use App\Models\Onboarding\Contact_information;
use App\Models\Onboarding\Onboarding_file;
use App\Models\Onboarding\Bank_information;

use Carbon\Carbon;

class ContactinformationController extends Controller {

    const DATA_SET_RULES = [
        'file' => 'required|mimes:pdf|max:2048',
        'collection_name' => 'required|string'
    ];

    function index() {

    }

    function show($id=null) {

    }

    function uploadfile(Request $request) {

        $validatedData = $this->validate($request, self::DATA_SET_RULES);
        $attachment = Attachment::create(['uploader_id' => auth()->user()->id]);
        $attachment->addMedia($request->file)->toMediaCollection($validatedData['collection_name'], 's3');

        if ($attachment) {
            $media = $attachment->media->first(); // attachment mengambil relasi (->) dari media
            if ($media) {
                $attachment = new \stdClass(); //stdClass membuat kosong
                $attachment->id = $media->id;
                $attachment->filename = $media->file_name;
                $attachment->name = $media->name;
                $attachment->download_url = $media->getFullUrlFromS3();
                $attachment->file_url = $media->getFullUrlFromS3();
                $attachment->mime = $media->mime_type;
                $attachment->collection_name = $media->collection_name;
                $attachment->model_id = $media->model_id;

                return response()->success(__('attachment.success.upload'), $attachment);
            }
        }

        return response()->error(__('attachment.error.upload'), 500);
    }

    function store (Request $request){

        $validatedData = $this->validate($request,
            [
                'first_name'=>'required|string',
                'last_name'=>'nullable|string',
                'middle_initial'=>'nullable|string',
                'mailing_address'=>'nullable|string',
                'phone'=>'nullable|string',
                'mobile'=>'nullable|string',
                'other'=>'nullable|string',
                'fax'=>'nullable|string',
                'passport'=>'nullable|string',
                'passport_expiration_date'=>'nullable|string',
                'issuing_location'=>'nullable|string',
                'email'=>'required|email',

                'emergency_name'=>'nullable|string',
                'emergency_phone'=>'nullable|string',
                'emergency_relationship'=>'nullable|string',
                'beneficiary_name'=>'nullable|string',
                'beneficiary_phone'=>'nullable|string',
                'beneficiary_relationship'=>'nullable|string',

                'acc_us_account_holder_name'=>'nullable|string',
                'acc_us_bank'=>'nullable|string',
                'acc_us_account'=>'nullable|string',
                'acc_us_aba'=>'nullable|string',

                'acc_over_account_holder_name'=>'nullable|string',
                'acc_over_bank'=>'nullable|string',
                'acc_over_account'=>'nullable|string',
                'acc_over_swift'=>'nullable|string',
                'acc_over_bank_address'=>'nullable|string',
                'acc_over_intermediary_bank'=>'nullable|string',
                'acc_over_aba'=>'nullable|string',

                'for_curr_over_account_holder_name'=>'nullable|string',
                'for_curr_over_bank'=>'nullable|string',
                'for_curr_over_account'=>'nullable|string',
                'for_curr_over_swift'=>'nullable|string',
                'for_curr_over_bank_address'=>'nullable|string',
                'for_curr_over_currency'=>'nullable|string',
                'for_curr_over_iban'=>'nullable|string',

                'contract'=>'required',
                'personal_data'=>'required',
                'conflict_of_interest'=>'required',

            ]
        );

        $record = Contact_information::where('email', '=', $validatedData['email'])->first();
        if($record!==null) {
            $record->delete();
        }

        $emergency=array(
            'name'=>$validatedData['emergency_name'],
            'phone'=>$validatedData['emergency_phone'],
            'relationship'=>$validatedData['emergency_relationship'],
        );
        $beneficiary=array(
            'name'=>$validatedData['beneficiary_name'],
            'phone'=>$validatedData['beneficiary_phone'],
            'relationship'=>$validatedData['beneficiary_relationship'],
        );

        $ci = new Contact_information;
        $ci->first_name= $validatedData['first_name'];
        $ci->last_name= $validatedData['last_name'];
        $ci->middle_initial= $validatedData['middle_initial'];
        $ci->mailing_address= $validatedData['mailing_address'];
        $ci->phone= $validatedData['phone'];
        $ci->mobile= $validatedData['mobile'];
        $ci->fax= $validatedData['fax'];
        $ci->other= $validatedData['other'];

        $ci->passport= $validatedData['passport'];

        if(!empty($validatedData['passport_expiration_date'])) {
            $carbon = new Carbon($validatedData['passport_expiration_date']);
            $carbon->format('Y-m-d');

            $expp=sprintf('%04d-%02d-%02d', $carbon->year, $carbon->month, $carbon->day);

            $ci->passport_expiration_date= $expp;
        }

        $ci->issuing_location= $validatedData['issuing_location'];
        $ci->email= $validatedData['email'];

        $ci->passport= $validatedData['passport'];

        $ci->issuing_location= $validatedData['issuing_location'];
        $ci->emergency_contact_information= json_encode($emergency);
        $ci->beneficiary_contact_information= json_encode($beneficiary);
        $ci->save();

        $file = new Onboarding_file;

        $file->contact_id= $ci['id'];
        $file->media_id= $validatedData['contract']['id'];
        $file->file_type= $validatedData['contract']['collection_name'];
        $file->file_name= $validatedData['contract']['filename'];
        $file->name= $validatedData['contract']['name'];
        $file->attachments_id= $validatedData['contract']['model_id'];

        $file->save();

        $file = new Onboarding_file;

        $file->contact_id= $ci['id'];
        $file->media_id= $validatedData['personal_data']['id'];
        $file->file_type= $validatedData['personal_data']['collection_name'];
        $file->file_name= $validatedData['personal_data']['filename'];
        $file->name= $validatedData['personal_data']['name'];
        $file->attachments_id= $validatedData['personal_data']['model_id'];

        $file->save();

        $file = new Onboarding_file;

        $file->contact_id= $ci['id'];
        $file->media_id= $validatedData['conflict_of_interest']['id'];
        $file->file_type= $validatedData['conflict_of_interest']['collection_name'];
        $file->file_name= $validatedData['conflict_of_interest']['filename'];
        $file->name= $validatedData['conflict_of_interest']['name'];
        $file->attachments_id= $validatedData['conflict_of_interest']['model_id'];

        $file->save();

        $bank = new Bank_information;

        $bank->contact_id= $ci['id'];

        $if_account_in_us=array(
            'account_holder_name'=>$validatedData['acc_us_account_holder_name'],
            'bank'=>$validatedData['acc_us_bank'],
            'account'=>$validatedData['acc_us_account'],
            'aba'=>$validatedData['acc_us_aba'],
        );

        $bank->if_account_in_us= json_encode($if_account_in_us);

        $if_account_overseas=array(
            'account_holder_name'=> $validatedData['acc_over_account_holder_name'],
            'bank'=> $validatedData['acc_over_bank'],
            'account'=> $validatedData['acc_over_account'],
            'swift'=> $validatedData['acc_over_swift'],
            'bank_address'=> $validatedData['acc_over_bank_address'],
            'intermediary_bank'=> $validatedData['acc_over_intermediary_bank'],
            'aba'=> $validatedData['acc_over_aba'],
        );
        $bank->if_account_overseas= json_encode($if_account_overseas);

        $if_foreign_currency_overseas=array(
            'account_holder_name'=> $validatedData['for_curr_over_account_holder_name'],
            'bank'=> $validatedData['for_curr_over_bank'],
            'account'=> $validatedData['for_curr_over_account'],
            'swift'=> $validatedData['for_curr_over_swift'],
            'bank_address'=> $validatedData['for_curr_over_bank_address'],
            'currency'=> $validatedData['for_curr_over_currency'],
            'iban'=> $validatedData['for_curr_over_iban'],
        );
        $bank->if_foreign_currency_overseas= json_encode($if_foreign_currency_overseas);
        $bank->save();

        return response()->success(__('crud.success.default'));
    }

    function getmediafile($file, $collection_name) {
        $adddata = array();
        if (!empty($file)) {
            $media = \App\Models\Attachment::findorfail($file);

            return array(
                'media_id' => $media->getMedia($collection_name)[0]->id,
                'file_name' => $media->getMedia($collection_name)[0]->file_name,
                'name' => $media->getMedia($collection_name)[0]->name
            );
        } else {
            return $adddata;
        }

    }

    function removefile($id){

        $record = Attachment::findOrFail($id);
        $deleted = $record->delete();

        if ($deleted) {
            return response()->success(__('attachment.success.delete'));
        }

        return response()->error(__('attachment.error.delete'), 500);
    }

}
