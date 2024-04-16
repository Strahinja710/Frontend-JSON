const fetchData = async () => {
    try {
        const response = await fetch(`http://localhost:3000/students`)
        console.log(response)
        const data = await response.json()
        console.log(data)
        let table = document.getElementById("tableBody")
        table.innerHTML = null // da se ne slažu novi redovi ponovo na stare

        data?.forEach(student => {
            let row =
                `
            <tr>
                <td>${student?.id}</td>
                <td>${student?.name}</td>
                <td>${student?.age}</td>
                <td>${student?.grade}</td>
                <td>${student?.enrollmentDate}</td>
                <td><button type="button" class="delete-btn" data-id="${student?.id}">DELETE</button></td>
                <td><button class="select-btn" data-id="${student?.id}">SELECT</button></td>
            </tr>
            `
            table.innerHTML += row
        })
        
    } catch (error) {
        console.log("Error happened:", error?.message);
    }
}

const deleteItem = async (studentId) => {
    try {
        const response = await fetch(`http://localhost:3000/students/${studentId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.ok) {
            alert(`Izbrisan student sa id: ${studentId}`)
        } else {
            throw new Error('Network response was not ok.')
        }
    } catch (err) {
        alert("Can't delete student!")
    }

    fetchData()
}

 
const saveStudent = async (e) => {
    e.preventDefault()

    const data = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        grade: document.getElementById("grade").value,
        enrollmentDate: document.getElementById("enrollmentDate").value
    }

    try {
        const response = await fetch(`http://localhost:3000/students`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })

        if (response.ok) {
            alert(`Student added: ${data?.name}`)
        } else {
            throw new Error('Network response was not ok.')
        }
    } catch (err) {
        alert("Can't save student!")
    }

    fetchData()
}

let selectedStudentId = null

const selectStudent = async (studentId) => {
    try {
        const response = await fetch(`http://localhost:3000/students/${studentId}`)
        const data = await response.json()

        document.getElementById("nameUpdate").value = data?.name
        document.getElementById("ageUpdate").value = data?.age
        document.getElementById("gradeUpdate").value = data?.grade
        document.getElementById("enrollmentDateUpdate").value = data?.enrollment_date

        if (!response.ok) {
            throw new Error('Network response was not ok.')
        }else{
            selectedStudentId = studentId
        }
    } catch (err) {
        alert("Can't select student!")
    }
}

const updateStudent = async (e) => {
    e.preventDefault()

    if(!selectedStudentId) return

    const data = {
        name: document.getElementById("nameUpdate").value,
        age: document.getElementById("ageUpdate").value,
        grade: document.getElementById("gradeUpdate").value,
        enrollmentDate: document.getElementById("enrollmentDateUpdate").value
    }

    try {
        const response = await fetch(`http://localhost:3000/students/${selectedStudentId}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json"
            }
        })

        if (response.ok) {
            alert(`Student updated: ${data?.name}`)
        } else {
            throw new Error('Network response was not ok.')
        }
    } catch (err) {
        alert("Can't update student! There is no student with this id!")
    }

    fetchData()
}

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("tableBody");

    tableBody.addEventListener("click", async (event) => {
        if (event.target && event.target.classList.contains("delete-btn")) {
            const studentId = event.target.getAttribute("data-id");
            await deleteItem(studentId);
        }
        if (event.target && event.target.classList.contains("select-btn")) {
            const studentId = event.target.getAttribute("data-id");
            await selectStudent(studentId);
        }
    });
});

document.getElementById('inputForm').addEventListener('submit', saveStudent)
document.getElementById('updateForm').addEventListener('submit', updateStudent)

fetchData()
