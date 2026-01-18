import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import newRequest from "../../../utils/newRequest";

function AddUser({ isVisible, setVisibility, refreshUsers }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        deptcode: "",
    });
    const [departments, setDepartments] = useState([]);
    const [emailError, setEmailError] = useState("");

    useEffect(() => {
        if (isVisible) {
            fetchDepartments();
        }
    }, [isVisible]);

    const fetchDepartments = async () => {
        try {
            const response = await newRequest.get("/api/v1/departments/all");
            setDepartments(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch departments");
        }
    };

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError("Please enter a valid email address");
            } else {
                setEmailError("");
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await newRequest.post("/api/v1/user/register", formData);
            if (response.data.success) {
                toast.success(response?.data?.message || "User created successfully");
                setFormData({ email: "", password: "", name: "", deptcode: "" });
                setVisibility(false);
                
                setTimeout(() => {
                    refreshUsers();
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while creating user";
            toast.error(errorMessage);
        }
    };

    return (
        <Modal isOpen={isVisible} onClose={() => setVisibility(false)}>
            <ModalContent>
                <ModalHeader>Add New User</ModalHeader>
                <ModalBody>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Name"
                            placeholder="Enter name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        <Input
                            label="Email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            errorMessage={emailError}
                            isInvalid={!!emailError}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                        <Select
                            label="Department"
                            placeholder="Select department"
                            value={formData.deptcode}
                            onChange={(e) => handleInputChange("deptcode", e.target.value)}
                        >
                            {departments.map((dept) => (
                                <SelectItem key={dept.tblDepartmentID} value={dept.deptcode}>
                                    {dept.deptname}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={() => setVisibility(false)}>
                        Cancel
                    </Button>
                    <Button 
                        color="primary" 
                        onPress={handleSubmit}
                        className="bg-primary-600 text-white shadow-lg hover:bg-primary-700"
                    >
                        Add User
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddUser;
