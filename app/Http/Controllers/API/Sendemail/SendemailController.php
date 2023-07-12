<?php

namespace App\Http\Controllers\API\Sendemail;

use App\Models\Sendemail\Sendemail;
use App\Models\Sendemail\Sendemail_to;
use App\Models\Sendemail\Sendemail_cc;
use App\Models\Sendemail\Sendemail_bcc;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\Sendmailtemplate;

/**
 * This Feature is not needed anymore
 * deactivate mode, the front end also commented
 */
class SendemailController extends Controller {

    function store(Request $request) {


        $validatedData = $this->validate($request, [
            'subject' => 'required|string',
            'body' => 'required|string',

            'to' => 'required|array',
            'cc' => 'sometimes|nullable|array',
            'bcc' => 'sometimes|nullable|array',
        ]);

        $sendemail = Sendemail::create([
            'title' => $validatedData['subject'],
            'content' => $validatedData['body'],

        ]);

        foreach($validatedData['to'] as $to) {

            Sendemail_to::create([
                'email' => $to,
                'send_email_id' => $sendemail->id
            ]);

        }

        if(!empty($validatedData['cc'])) {
            foreach($validatedData['cc'] as $cc) {

                Sendemail_cc::create([
                    'email' => $cc,
                    'send_email_id' => $sendemail->id
                ]);

            }
        }


        if(!empty($validatedData['bcc'])) {
            foreach($validatedData['bcc'] as $bcc) {

                Sendemail_bcc::create([
                    'email' => $bcc,
                    'send_email_id' => $sendemail->id
                ]);

            }

        }

        $status='';
        foreach($validatedData['to'] as $to) {

            try {

                Mail::to($to)->send(
                    new Sendmailtemplate(
                        $validatedData, $to
                    )
                );

                $status='Success';
            } catch (Exception $ex) {
                $status='Error';
            }
        }

        Sendemail::where('id', '=', $sendemail->id)->update(
            array(
                "status" => $status
            )
        );

        return response()->success(__('crud.success.default'));
    }

    function index() {
        $email = Sendemail::with(['to', 'cc', 'bcc'])->paginate(20);

        return response()->success(__('crud.success.default'), $email);
    }



}
