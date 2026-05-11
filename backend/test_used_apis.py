import socket
import unittest
from app.core.config import settings

def _has_r2_config() -> bool:
    # Return True when all R2 credentials and bucket settings are non-empty strings.
    required = (
        settings.R2_ACCESS_KEY,
        settings.R2_SECRET_KEY,
        settings.R2_ENDPOINT_URL,
        settings.R2_BUCKET_NAME,
    )
    return all(isinstance(v, str) and v.strip() for v in required)

def _has_network() -> bool:
    # Run network tests online/offline if possible
    try:
        with socket.create_connection(("1.1.1.1", 443), timeout=1.0):
            return True
    except OSError:
        return False

# Skip all tests if not configured or offline.
if not _has_r2_config():
    raise unittest.SkipTest("R2 env vars missing/empty; skipping API tests.")

if not _has_network():
    raise unittest.SkipTest("No network connectivity; skipping API tests.")


class TestSchoolsApi(unittest.TestCase):
    # Ensure R2 data is loaded correctly
    def test_list_schools_returns_list(self) -> None:
        # list_schools returns a list; non-empty results include school_name and available_courses.
        from app.api.v1.routes.schools import list_schools
        data = list_schools()
        self.assertIsInstance(data, list)
        if data:
            self.assertIn("school_name", data[0])
            self.assertIn("available_courses", data[0])
            self.assertIsInstance(data[0]["available_courses"], list)


class TestMajorsApi(unittest.TestCase):
    # Major tests to ensure R2 data is loaded correctly
    def test_list_majors_returns_list(self) -> None:
        # list_majors is blank returns a list and non-empty results include major_name.
        from app.api.v1.routes.majors import list_majors
        data = list_majors(school_name=None)
        self.assertIsInstance(data, list)
        if data:
            self.assertIn("major_name", data[0])

    def test_list_majors_with_school_name(self) -> None:
        # Test major with school name to ensure school shows correct major
        from app.api.v1.routes.majors import list_majors

        data = list_majors(school_name="Cuyamaca College")
        self.assertIsInstance(data, list)


class TestAuditsGenerate(unittest.TestCase):
    # checks generate_audit end to end with real data
    def test_generate_audit_basic_shape(self) -> None:
        #generate audit with expected test data
        from app.api.v1.routes.audits import AuditRequest, generate_audit
        from app.schemas.Schema import CourseInput

        req = AuditRequest(
            school_name="Cuyamaca College",
            major_name="Computer Science",
            courses_entered=[CourseInput(course_name="MATH 150", community_college="Cuyamaca College")],
        )
        data = generate_audit(req).model_dump()
        for key in (
            "chosen_major",
            "chosen_school",
            "completed_courses",
            "uncompleted_courses",
            "total_units_completed",
            "total_units_remaining",
            "total_units_required",
        ):
            self.assertIn(key, data)
        self.assertIsInstance(data["completed_courses"], list)
        self.assertIsInstance(data["uncompleted_courses"], list)

    def test_generate_audit_dedupes_duplicate_courses(self) -> None:
        # Duplicate courses should only show 1 entry
        from app.api.v1.routes.audits import AuditRequest, generate_audit
        from app.schemas.Schema import CourseInput

        req = AuditRequest(
            school_name="Cuyamaca College",
            major_name="Computer Science",
            courses_entered=[
                CourseInput(course_name="MATH 150", community_college="Cuyamaca College"),
                CourseInput(course_name="math150", community_college="Cuyamaca College"),
            ],
        )
        data = generate_audit(req).model_dump()
        # Only show 1 entry
        self.assertLessEqual(len(data["completed_courses"]), 1)

