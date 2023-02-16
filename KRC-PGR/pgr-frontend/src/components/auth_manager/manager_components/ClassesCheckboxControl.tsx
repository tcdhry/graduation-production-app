import { useState, useEffect } from "react";
import { Row, Col } from "../../global_components/24ColLayout";
import { LabelCheckbox } from "../../global_components/LabelInput";


type MinClassesType = Array<{
    class_id: number | null,
    class_name: null | string,
    department_id: number | null,
    department_name: null | string,
    faculty_id: number | null,
    faculty_name: null | string
}>;

function ClassesCheckboxControl(props: { classes: MinClassesType }) {
    const [classes, setClasses] = useState<MinClassesType>([]);
    const [departments, setDepartments] = useState<MinClassesType>([]);
    const [faculties, setFaculties] = useState<MinClassesType>([]);

    useEffect(() => {
        if (props.classes === undefined) {
            return;
        }

        const newClasses: MinClassesType = [];
        const newDepartments: MinClassesType = [];
        const newFaculties: MinClassesType = [];
        props.classes.forEach((minClass) => {
            if (!newClasses.map((cls) => cls.class_id).includes(minClass.class_id)) {
                const newClass = minClass;
                newClasses.push(newClass);
                if (!newDepartments.map((dep) => dep.department_id).includes(minClass.department_id)) {
                    newDepartments.push(newClass);
                    if (!newFaculties.map((fac) => fac.faculty_id).includes(minClass.faculty_id)) {
                        newFaculties.push(newClass);
                    }
                }
            }
        });
        setClasses(newClasses);
        setDepartments(newDepartments);
        setFaculties(newFaculties);
    }, [props.classes]);

    return (
        <>
            <Row>
                <Col width={11}>
                    <h4>分類</h4>
                    <p>
                        {
                            faculties?.map(fac => (
                                <LabelCheckbox
                                    key={fac.faculty_id}
                                    value={String(fac.faculty_id)}
                                    id={'faculty-' + String(fac.faculty_id)}
                                    name="select-faculty"
                                    labelText={fac.faculty_name === null ? 'その他' : fac.faculty_name}
                                    defaultChecked={true}
                                    onChange={function (event) {
                                        const list: Array<HTMLInputElement> = Array.from(event.currentTarget.form!.querySelectorAll(`input[type="checkbox"][data-f="${fac.faculty_id}"]`));
                                        list.forEach(checkbox => { checkbox.checked = event.target.checked; });
                                    }}
                                />
                            ))
                        }
                    </p>
                    <h4>学科</h4>
                    <p>
                        {
                            departments.map(dep => (
                                <LabelCheckbox
                                    key={dep.department_id}
                                    value={String(dep.department_id)}
                                    id={'department-' + String(dep.department_id)}
                                    name="select-department"
                                    labelText={dep.department_name === null ? 'その他' : dep.department_name}
                                    defaultChecked={true}
                                    onChange={function (event) {
                                        const list: Array<HTMLInputElement> = Array.from(event.currentTarget.form!.querySelectorAll(`input[type="checkbox"][data-d="${dep.department_id}"]`));
                                        list.forEach(checkbox => { checkbox.checked = event.target.checked; });
                                    }}
                                />
                            ))
                        }
                    </p>
                </Col>
                <Col offset={2} width={11}>
                    <h4>クラス</h4>
                    <p>
                        {
                            classes.map(cls => (
                                <LabelCheckbox
                                    key={cls.class_id}
                                    value={String(cls.class_id)}
                                    id={'class-' + String(cls.class_id)}
                                    name="select-class"
                                    labelText={cls.class_name === null ? 'その他' : cls.class_name}
                                    defaultChecked={true}
                                    onChange={function (event) {
                                        const list: Array<HTMLInputElement> = Array.from(event.currentTarget.form!.querySelectorAll(`input[type="checkbox"][data-c="${cls.class_id}"]`));
                                        list.forEach(checkbox => { checkbox.checked = event.target.checked; });
                                    }}
                                />
                            ))
                        }
                    </p>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col width={12}>
                    <button type="button" className="btn btn-full" onClick={function (event) {
                        Array.from(event.currentTarget.form!.querySelectorAll('input[type="checkbox"]'))
                            .forEach((checkbox) => { (checkbox as HTMLInputElement).checked = false; });
                    }}>全て外す</button>
                </Col>
                <Col width={12}>
                    <button type="button" className="btn btn-full" onClick={function (event) {
                        Array.from(event.currentTarget.form!.querySelectorAll('input[type="checkbox"]'))
                            .forEach((checkbox) => { (checkbox as HTMLInputElement).checked = true; });
                    }}>全てチェック</button>
                </Col>
            </Row>
        </>
    );
}

export default ClassesCheckboxControl;