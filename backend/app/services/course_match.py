from typing import Any, Dict, List, Optional

def compact_alnum(s: str) -> str:
    return "".join(c.upper() for c in (s or "") if c.isalnum())

def catalog_cc_key(catalog_cc: str) -> str:
    ## Change PSYC195_CUYAMACA -> PSYC195 and MATH150 -> MATH150.
    part = (catalog_cc or "").split("_", 1)[0]
    return compact_alnum(part)
## Ensures course entry matrches catalog for school
def course_entry_matches_catalog(user_course: str, catalog_cc: str) -> bool:
    u = compact_alnum(user_course)
    if not u:
        return False
    key = catalog_cc_key(catalog_cc)
    if key and u == key:
        return True
    if u == compact_alnum(catalog_cc):
        return True
    return False
## School catalog id function
def school_catalog_id(schools: List[Dict[str, Any]], school_name: str) -> Optional[str]:
    for s in schools:
        if str(s.get("school_name", "")).lower() == school_name.lower():
            sid = s.get("id")
            if sid is None:
                return None
            return str(sid).upper().replace(" ", "")
    return None
## Final wrap for equivalent classes from school
def filter_equivalencies_by_school(
    equivalencies: List[Dict[str, Any]],
    school_id: Optional[str],
) -> List[Dict[str, Any]]:
    if not school_id:
        return equivalencies
    want = school_id.upper()
    out: List[Dict[str, Any]] = []
    for e in equivalencies:
        fs = e.get("from_school")
        if fs is None or str(fs).upper() == want:
            out.append(e)
    return out
