<?php

namespace App\Traits;

trait UserTrait {

    /**
     * Generate the fullname from first, middle and family name
     */
    public function getFullName(array $userData)
    {
        // check if the first, middle, and family name exists
        if (!empty($userData['first_name']) && !empty($userData['family_name']) && !empty($userData['middle_name'])) {
            // check if it has the same value between those 3 names
            if (($userData['first_name'] == $userData['family_name']) && ($userData['family_name'] == $userData['middle_name'])) {
                $userData['full_name'] = $userData['first_name'];

                return $userData;
            }
        }

        if (!empty($userData['first_name']) && !empty($userData['family_name'])) {
            $userData['full_name'] = $userData['first_name'] . ' ';
            if (!empty($userData['middle_name'])) {
                $userData['full_name'] .= $userData['middle_name'] . ' ';
            }
            $userData['full_name'] .= $userData['family_name'];
        }

        return $userData;
    }
}
