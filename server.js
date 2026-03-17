const http = require("http");

let students = [];
const emailRegex = /\S+@\S+\.\S+/;

const PORT = 3000;

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");
    const url = req.url;
    const method = req.method;

    if (url === "/students" && method === "GET") {

    res.writeHead(200);

    res.end(JSON.stringify({
        success: true,
        data: students
    }));

}
    
    else if (url === "/students" && method === "POST") {

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        if (!data.name || !data.email || !data.course || !data.year) {
            res.writeHead(400);
            return res.end(JSON.stringify({
                success: false,
                message: "All fields are required"
            }));
        }

        if (!emailRegex.test(data.email)) {
            res.writeHead(400);
            return res.end(JSON.stringify({
                success: false,
                message: "Invalid email format"
            }));
        }

        if (data.year < 1 || data.year > 4) {
            res.writeHead(400);
            return res.end(JSON.stringify({
                success: false,
                message: "Year must be between 1 and 4"
            }));
        }

        const student = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        course: data.course,
        year: data.year,
        createdAt: new Date(),
        updatedAt: new Date()
};

     students.push(student);

     res.writeHead(201);

     res.end(JSON.stringify({
     success: true,
     data: student
  }));

    });
}
   
    else if (url.startsWith("/students/") && method === "GET") {

    const id = url.split("/")[2];

    const student = students.find(s => s.id === id);

    if (!student) {

        res.writeHead(404);

        return res.end(JSON.stringify({
            success: false,
            message: "Student not found"
        }));
    }

    res.writeHead(200);

    res.end(JSON.stringify({
        success: true,
        data: student
    }));

}
    
    else if (url.startsWith("/students/") && method === "PUT") {

    const id = url.split("/")[2];

    let body = "";

    req.on("data", chunk => {
        body += chunk.toString();
    });

    req.on("end", () => {

        const data = JSON.parse(body);

        const student = students.find(s => s.id === id);

        if (!student) {
            student.name = data.name;
            student.email = data.email;
            student.course = data.course;
            student.year = data.year;
            
            student.updatedAt = new Date();

            res.writeHead(404);

            return res.end(JSON.stringify({
                success: false,
                message: "Student not found"
            }));
        }

        student.name = data.name;
        student.email = data.email;
        student.course = data.course;
        student.year = data.year;

        res.writeHead(200);

        res.end(JSON.stringify({
            success: true,
            data: student
        }));

    });

}

   else if (url.startsWith("/students/") && method === "DELETE") {

    const id = url.split("/")[2];

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {

        res.writeHead(404);

        return res.end(JSON.stringify({
            success: false,
            message: "Student not found"
        }));
    }

    students.splice(index, 1);

    res.writeHead(200);

    res.end(JSON.stringify({
        success: true,
        message: "Student deleted successfully"
    }));
}

    else {

    res.writeHead(404);

    res.end(JSON.stringify({
        success: false,
        message: "Route not found"
    }));

}
 });


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});