<?php

namespace App\Traits;

use App\Models\User;
use App\Models\Profile;

/**
 * This is the file containing function to be used in any controller to check a user(s) is iMMAPer or not
 */
trait iMMAPerTrait
{
    /**
     * ================ checkUnverifiedIMMAPerFromSelectedUser Function ===================
     * This is a function to check if selected user is Unverified iMMAPer of Not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkUnverifiedIMMAPerFromSelectedUser(User $user) {
        $profile = $user->profile;
        return ($profile->is_immaper == 1 && $profile->verified_immaper == 0 && !empty($profile->immap_email) && !is_null($profile->immap_email) && (date('Y-m-d') <= date($profile->end_of_current_contract))) ? true : false;
    }

    /**
     * ================= checkVerifiedIMMAPerFromSelectedUser Function ====================
     * This is a function to check if selected user is Verified iMMAPer of Not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkVerifiedIMMAPerFromSelectedUser(User $user) {
        $profile = $user->profile;
        return ($profile->is_immaper == 1 && $profile->verified_immaper == 1 && !empty($profile->immap_email) && !is_null($profile->immap_email) && (date('Y-m-d') <= date($profile->end_of_current_contract))) ? true : false;
    }

    /**
     * ================ checkUnverifiedIMMAPerFromSelectedProfile Function ===================
     * This is a function to check if selected user is Unverified iMMAPer of Not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkUnverifiedIMMAPerFromSelectedProfile(Profile $profile) {
        return ($profile->is_immaper == 1 && $profile->verified_immaper == 0 && !empty($profile->immap_email) && !is_null($profile->immap_email) && (date('Y-m-d') <= date($profile->end_of_current_contract))) ? true : false;
    }

    /**
     * ================= checkVerifiedIMMAPerFromSelectedProfile Function ====================
     * This is a function to check if selected user is Verified iMMAPer of Not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkVerifiedIMMAPerFromSelectedProfile(Profile $profile) {
        return ($profile->is_immaper == 1 && $profile->verified_immaper == 1 && !empty($profile->immap_email) && !is_null($profile->immap_email) && (date('Y-m-d') <= date($profile->end_of_current_contract))) ? true : false;
    }

    /**
     * ===================== checkIMMAPerFromSelectedUser Function ========================
     * This is a function to check if selected user is iMMAPer of Not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkIMMAPerFromSelectedUser(User $user) {
        return ($user->profile->is_immaper == 1 && $user->profile->verified_immaper == 1 && (date('Y-m-d') <= date($user->profile->end_of_current_contract)) &&
        (date('Y-m-d') >= date($user->profile->start_of_current_contract)))  ? true : false;
    }

    /**
     * ===================== checkWasIMMAPerFromSelectedUser Function ========================
     * This is a function to check if selected user was an iMMAPer of Not
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkWasIMMAPerFromSelectedUser(User $user) {
        return ($user->profile->is_immaper == 1 && $user->profile->verified_immaper == 1 && (date('Y-m-d') > date($user->profile->end_of_current_contract))) ? true : false;
    }

    /**
     * ======================== partOfIMMAPFromSelectedUser Function ==========================
     * This is a function to run query to filter user who was and still an iMMAPer from User Query model
     * $user is a selected user
     *      > please see the controller that using this function to understood how it works
     *      > this function return boolean true / false
     * ====================================================================================
     */
    public function partOfIMMAPFromSelectedUser(User $user) {
        return $userQuery->whereHas('profile', function ($query) {
            $query->where('is_immaper', 1)->where('verified_immaper', 1)->where(function($subQuery) {
                $subQuery->where('end_of_current_contract', '>', date('Y-m-d'))->orWhere('end_of_current_contract', '<=', date('Y-m-d'));
            });
        });
    }

    /**
     * ==================== checkIMMAPerFromSelectedProfile Function ======================
     * This is a function to check if selected profile is iMMAPer of Not
     * $profile is a selected profile inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkIMMAPerFromSelectedProfile(Profile $profile) {
        return ($profile->is_immaper == 1 && $profile->verified_immaper == 1 && (date('Y-m-d') <= date($profile->end_of_current_contract))) ? true : false;
    }

    /**
     * ==================== checkWasIMMAPerFromSelectedProfile Function ======================
     * This is a function to check if selected profile was an iMMAPer of Not
     * $profile is a selected profile inside the controller
     */
    public function checkWasIMMAPerFromSelectedProfile(Profile $profile) {
        return ($profile->is_immaper == 1 && $profile->verified_immaper == 1 && (date('Y-m-d') > date($profile->end_of_current_contract))) ? true : false;
    }

    /** ===================== checkPartOfIMMAPFromSelectedUser Function ========================
     * This is a function to check if selected user is/was iMMAP employee
     * $user is a selected user inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return true / false
     * ====================================================================================
     */
    public function checkPartOfIMMAPFromSelectedUser(User $user) {
        return ($user->profile->is_immaper == 1 && $user->profile->verified_immaper == 1) ? true : false;
    }

    /**
     * ========================= iMMAPerFromUserQuery Function ============================
     * This is a function to run query to filter iMMAPer from User Query model
     * $userQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function iMMAPerFromUserQuery($userQuery) {
        return $userQuery->whereHas('profile', function ($query) {
            $query->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '>=', date('Y-m-d'));
        });
    }

    /**
     * ================ iMMAPerFromUserQuery Function for iMMAPers List ===================
     * This is a function to run query to filter iMMAPer from User Query model
     * $userQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function iMMAPerListQuery($userQuery) {
        return $userQuery->whereIn('users.status', ['Active', 'Inactive'])->where(function ($query){
            $query->where('users.p11Completed', 1)->orWhere('users.access_platform', 0);
        })->whereHas('profile', function ($query) {
            $query->where(function($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '>=', date('Y-m-d'));
            })->orWhere(function($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '<', date('Y-m-d'));
            });
        });
    }

    /**
     * ======================== nonIMMAPerFromUserQuery Function ==========================
     * This is a function to run query to filter non iMMAPer from User Query model
     * $userQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function nonIMMAPerFromUserQuery($userQuery) {
        return $userQuery->whereHas('profile', function ($query) {
            $query->where('is_immaper', 0)->orWhere(function ($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '<', date('Y-m-d'));
            })->orWhere(function ($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 0);
            });
        });
    }

    /**
     * ========================= iMMAPerFromProfileQuery Function ============================
     * This is a function to run query to filter iMMAPer from Profile Query model
     * $profileQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function iMMAPerFromProfileQuery($profileQuery) {
        return $profileQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '>=', date('Y-m-d'));
    }

    /**
     * ======================== nonIMMAPerFromProfileQuery Function ==========================
     * This is a function to run query to filter non iMMAPer from Profile Query model
     * $profileQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function nonIMMAPerFromProfileQuery($profileQuery) {
        return $profileQuery->where(function ($query) {
            $query->where('is_immaper', 0)->orWhere(function ($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '<', date('Y-m-d'));
            })->orWhere(function ($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 0);
            });
        });
    }

    /**
     * ============= nonIMMAPerQuery Function for Add user to iMMAPer List ================
     * This is a function to run query to filter non iMMAPer used in Add iMMAPer Form
     * $nonIMMAPerQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function nonIMMAPerQueryForSearchingNonIMMAPer($nonIMMAPerQuery) {
        return $nonIMMAPerQuery->where(function ($query){
            $query->where('users.p11Completed', 1)->orWhere('users.access_platform', 0);
        })->where(function ($query) {
            $query->where('profiles.is_immaper', 0)->orWhere('profiles.verified_immaper', 0)->orWhere(function ($subQuery) {
                $subQuery->where('profiles.is_immaper', 1)->where('profiles.verified_immaper', 1)->where('profiles.end_of_current_contract', '<', date('Y-m-d'));
            })->orWhere(function ($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 0);
            });
        });
    }

    /**
     * ======================== wasIMMAPerFromUserQuery Function ==========================
     * This is a function to run query to filter user who was an iMMAPer from User Query model
     * $userQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function wasIMMAPerFromUserQuery($userQuery) {
        return $userQuery->whereHas('profile', function ($query) {
            $query->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '>', date('Y-m-d'));
        });
    }

    /**
     * ========================= wasIMMAPerFromProfileQuery Function ============================
     * This is a function to run query to filter a user who was an iMMAPer from Profile Query model
     * $profileQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function wasIMMAPerFromProfileQuery($profileQuery) {
        return $profileQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where('end_of_current_contract', '>', date('Y-m-d'));
    }

    /**
     * ======================== partOfIMMAPFromUserQuery Function ==========================
     * This is a function to run query to filter user who was and still an iMMAPer from User Query model
     * $userQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function partOfIMMAPFromUserQuery($userQuery) {
        return $userQuery->whereHas('profile', function ($query) {
            $query->where('is_immaper', 1)->where('verified_immaper', 1)->where(function($subQuery) {
                $subQuery->where('end_of_current_contract', '>', date('Y-m-d'))->orWhere('end_of_current_contract', '<=', date('Y-m-d'));
            });
        });
    }

    /**
     * ========================= partOfIMMAPFromProfileQuery Function ============================
     * This is a function to run query to filter user who was and still an iMMAPer from Profile Query model
     * $profileQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function partOfIMMAPFromProfileQuery($profileQuery) {
        return $profileQuery->where('is_immaper', 1)->where('verified_immaper', 1)->where(function($subQuery) {
            $subQuery->where('end_of_current_contract', '>', date('Y-m-d'))->orWhere('end_of_current_contract', '<=', date('Y-m-d'));
        });
    }

    /**
     * ======================== notPartOfIMMAPFromUserQuery Function ==========================
     * This is a function to run query to filter user who was and still an iMMAPer from User Query model
     * $userQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function notPartOfIMMAPFromUserQuery($userQuery) {
        return $userQuery->whereHas('profile', function ($query) {
            $query->where(function($subQuery) {
                $subQuery->where('is_immaper', 0)->orWhere(function($subQuery) {
                    $subQuery->where('is_immaper', 1)->where('verified_immaper', 0);
                });
            });
        });
    }

    /**
     * ========================= notPartOfIMMAPFromProfileQuery Function ============================
     * This is a function to run query to filter user who was and still an iMMAPer from Profile Query model
     * $profileQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function notPartOfIMMAPFromProfileQuery($profileQuery) {
        return $profileQuery->where(function($subQuery) {
            $subQuery->where('is_immaper', 0)->orWhere(function($subQuery) {
                $subQuery->where('is_immaper', 1)->where('verified_immaper', 0);
            });
        });
    }

     /**
     * ========================= iMMAPersWithValideContractQuery Function ============================
     * This is a function to run query to filter user who have a valide contract from Profile Query model
     * $travelQuery is a query define inside the controller
     *      > please see the controller that using this function to understood how it works
     *      > this function return Query Builder
     * ====================================================================================
     */
    public function iMMAPersWithValideContractQuery($travelQuery) {
        return $travelQuery->whereHas('user', function($query) {
            $query->whereIn('status', ['Active', 'Inactive'])->whereHas('profile', function($subQuery){
                $subQuery->where(function($query) {
                    $query->where('is_immaper', 1)->where('verified_immaper', 1)->where('start_of_current_contract', '<=', date('Y-m-d'))->where('end_of_current_contract', '>=', date('Y-m-d'));
                });
            });
        });
    }
}
