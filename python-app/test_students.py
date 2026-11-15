import pytest
from students import get_connection, add_student, average_grade, get_student

@pytest.fixture
def conn():
    connection = get_connection()
    with connection.cursor() as cur:
        cur.execute("TRUNCATE students RESTART IDENTITY")  # table vidée avant chaque test
    connection.commit()
    yield connection
    connection.close()

def test_moyenne(conn):
    add_student(conn, "Amel", 10) # 1. Préparer : deux étudiants
    add_student(conn, "Karim", 14)
    assert average_grade(conn) == 12.0 # 2. Agir et 3. Vérifier : (10 + 14) / 2 = 12
 
def test_ajout_et_lecture(conn):
    student_id = add_student(conn, "Samy", 16)
    student = get_student(conn, student_id)
    assert student["name"] == "Samy"
    assert student["grade"] == 16.0


def test_etudiant_inexistant(conn):
    assert get_student(conn, 9999) is None