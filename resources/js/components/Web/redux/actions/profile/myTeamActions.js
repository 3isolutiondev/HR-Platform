import { STORE_MY_TEAM } from "../../types/profile/myTeamTypes"

export const storeStaffIds = (staffIds) => {
  return {
    type: STORE_MY_TEAM,
    value: staffIds
  }
}
