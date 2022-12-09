import { AuthorityID, AuthorityJapaneseName } from "../constants/Authority";

export type UserBean = {
    user_id: number,
    user_name: string,
    view_name: null | string,
    authority_id: AuthorityID,
    authority_name: AuthorityJapaneseName,
    homeroom_class: null | HomeroomClassBean,
    student_number: null | number
}

type HomeroomClassBean = {
    class_id: number,
    class_name: string,
    department_id: number,
    department_name: string,
    faculty_id: number,
    faculty_name: string
}

export function getUserViewName(user: UserBean) {
    return user.view_name === null ? user.user_name : user.view_name;
}