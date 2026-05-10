from typing import Any, Dict, List

def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []

def _normalize_course_equivalency_row(raw: Dict[str, Any]) -> Dict[str, Any]:
    if "cc_course_name" in raw and "sdsu_course_name" in raw:
        units = raw.get("units", 3.0)
        try:
            units_f = float(units)
        except (TypeError, ValueError):
            units_f = 3.0
        transferable = raw.get("is_transferable", True)
        if not isinstance(transferable, bool):
            transferable = True
        row: Dict[str, Any] = {
            "cc_course_name": str(raw["cc_course_name"]),
            "sdsu_course_name": str(raw["sdsu_course_name"]),
            "units": units_f,
            "is_transferable": transferable,
        }
        if raw.get("from_school") is not None:
            row["from_school"] = str(raw["from_school"])
        return row

    cc = raw.get("from_course") or raw.get("cc_course_name") or ""
    sdsu = raw.get("to_course") or raw.get("sdsu_course_name") or ""
    units = raw.get("units", 3.0)
    try:
        units_f = float(units)
    except (TypeError, ValueError):
        units_f = 3.0
    transferable = raw.get("is_transferable", True)
    if not isinstance(transferable, bool):
        transferable = True
    row: Dict[str, Any] = {
        "cc_course_name": str(cc),
        "sdsu_course_name": str(sdsu),
        "units": units_f,
        "is_transferable": transferable,
    }
    if raw.get("from_school") is not None:
        row["from_school"] = str(raw["from_school"])
    return row
## Standard school sso it removes all extra data from the jsons database
def normalize_schools(records: Any) -> List[Dict[str, Any]]:
    if not isinstance(records, list):
        return []
    out: List[Dict[str, Any]] = []
    for raw in records:
        if not isinstance(raw, dict):
            continue
        name = raw.get("school_name") or raw.get("name") or ""
        courses_in = _as_list(raw.get("available_courses"))
        available_courses = []
        for row in courses_in:
            if isinstance(row, dict):
                available_courses.append(_normalize_course_equivalency_row(row))
        majors_in = raw.get("available_majors")
        available_majors = majors_in if isinstance(majors_in, list) else []
        entry: Dict[str, Any] = {
            "school_name": str(name),
            "available_courses": available_courses,
            "available_majors": available_majors,
        }
        if raw.get("id") is not None:
            entry["id"] = raw["id"]
        if raw.get("type") is not None:
            entry["type"] = raw["type"]
        out.append(entry)
    return out
## Standard majors so it removes all extra data
def normalize_majors(records: Any) -> List[Dict[str, Any]]:
    if not isinstance(records, list):
        return []
    out: List[Dict[str, Any]] = []
    for raw in records:
        if not isinstance(raw, dict):
            continue
        major_name = raw.get("major_name") or raw.get("name") or ""
        reqs_in = _as_list(raw.get("requirements"))
        requirements = []
        for row in reqs_in:
            if isinstance(row, dict):
                requirements.append(_normalize_course_equivalency_row(row))
        entry: Dict[str, Any] = {
            "major_name": str(major_name),
            "requirements": requirements,
        }
        for key in ("id", "degree", "school_id"):
            if raw.get(key) is not None:
                entry[key] = raw[key]
        out.append(entry)
    return out
## Normalize data output so easier to compare
def normalize_equivalencies(records: Any) -> List[Dict[str, Any]]:
    if not isinstance(records, list):
        return []
    out: List[Dict[str, Any]] = []
    for raw in records:
        if isinstance(raw, dict):
            out.append(_normalize_course_equivalency_row(raw))
    return out
