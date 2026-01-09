import mongoose from 'mongoose';

// Dummy data arrays for defaults
const defaultEducation = [{
    universityName: "Western Illinois University",
    degree: "Master",
    major: "Computer Science",
    startDate: "Aug 2018",
    endDate: "Dec 2019",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}];

const defaultExperience = [{
    title: "Full Stack Developer",
    companyName: "Amazon",
    city: "New York",
    state: "NY",
    startDate: "Jan 2021",
    endDate: "",
    workSummery: "• Designed, developed, and maintained full-stack applications using React and Node.js.\n• Implemented responsive UIs.\n• Created RESTful APIs."
}];

const defaultSkills = [
    { name: "React", rating: 100 },
    { name: "Node.js", rating: 90 },
    { name: "MongoDB", rating: 85 }
];

// Education Schema
const educationSchema = new mongoose.Schema({
    universityName: { type: String, default: "Western Illinois University" },
    degree: { type: String, default: "Master" },
    major: { type: String, default: "Computer Science" },
    startDate: { type: String, default: "Aug 2018" },
    endDate: { type: String, default: "Dec 2019" },
    description: {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
}, { _id: false });

// Experience Schema
const experienceSchema = new mongoose.Schema({
    title: { type: String, default: "Full Stack Developer" },
    companyName: { type: String, default: "Amazon" },
    city: { type: String, default: "New York" },
    state: { type: String, default: "NY" },
    startDate: { type: String, default: "Jan 2021" },
    endDate: { type: String, default: "" },
    workSummery: {
        type: String,
        default: "• Designed, developed, and maintained full-stack applications using React and Node.js.\n" +
            "• Implemented responsive user interfaces with React.\n" +
            "• Created RESTful APIs with Node.js and Express."
    }
}, { _id: false });

// Skills Schema
const skillsSchema = new mongoose.Schema({
    name: { type: String, default: "React" },
    rating: { type: Number, default: 100 }
}, { _id: false });

// Main Resume Schema
const resumeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: "Untitled Resume"
    },
    resumeId: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    firstName: { type: String, default: "James" },
    lastName: { type: String, default: "Carter" },
    jobTitle: { type: String, default: "Full Stack Developer" },
    address: { type: String, default: "525 N Tryon Street, NC 28117" },
    phone: { type: String, default: "(123)-456-7890" },
    email: { type: String, default: "example@gmail.com" },
    themeColor: { type: String, default: "#ff6666" }, // 🎨 Theme color
    summery: {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },

    // 🟢 Provide actual dummy arrays here
    education: {
        type: [educationSchema],
        default: defaultEducation
    },
    experience: {
        type: [experienceSchema],
        default: defaultExperience
    },
    skills: {
        type: [skillsSchema],
        default: defaultSkills
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Resume = mongoose.model("Resume", resumeSchema);
