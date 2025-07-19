import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/contact";
import { useEffect, useState, type ChangeEvent } from "react";


async function submitFormData(formData: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Failed to submit form');
    }

    return response.json();
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();

    const data = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phoneNumber: formData.get("phoneNumber"),
        emailAddress: formData.get("emailAddress"),
        confirmEmailAddress: formData.get("confirmEmailAddress"),
        message: formData.get("message")
    }

    const errors: Record<string, string> = {}

    if (!data.firstName) errors.firstName = "First name is required";
    if (!data.lastName) errors.lastName = "Last name is required";
    if (!data.emailAddress) errors.email = "Email is required";
    if (data.emailAddress && !/\S+@\S+\.\S+/.test(data.emailAddress as string)) {
        errors.email = "Email is invalid";
    }
    if (!data.message) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
        return { errors, data };
    }

    try {
        const result = await submitFormData(data);
        console.log("Form submitted successfully:", result);
        return redirect("/contact/success");
    } catch (error) {
        console.error("Error submitting form:", error);
        return {
            errors: { general: "Failed to submit form. Please try again." },
            data
        };
    }
}


export default function ContactPage() {
    const actionData = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState<string | null>(null);
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
    const [emailAddress, setEmailAddress] = useState("");
    const [emailAddressError, setEmailAddressError] = useState<string | null>(null);
    const [confirmEmailAddress, setConfirmEmailAddress] = useState("");
    const [confirmEmailAddressError, setConfirmEmailAddressError] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState<string | null>(null);

    const checkEmailMatch = useEffect(() => {
        if (emailAddress && confirmEmailAddress && emailAddress !== confirmEmailAddress) {
            setConfirmEmailAddressError("Email addresses do not match");
        } else {
            setConfirmEmailAddressError(null);
        }
    }, [emailAddress, confirmEmailAddress]);


    if (actionData?.errors) {
        console.error("Form submission errors:", actionData.errors);
    }

    if (actionData?.data) {
        console.log("Form data:", actionData.data);
    }

    return <div>
        <Form className="flex flex-col p-4" method="post">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstname" name="firstName" className="border-1 mb-2 rounded-md" onChange={(e) => { setFirstName(e.target.value) }} />
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" className="border-1 mb-2 rounded-md" onChange={(e) => { setLastName(e.target.value) }} />
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" className="border-1 mb-2 rounded-md" onChange={(e) => { setPhoneNumber(e.target.value) }} />
            <label htmlFor="emailAddress">Email Address</label>
            <input type="email" id="emailAddress" name="emailAddress" className="border-1 mb-2 rounded-md" onChange={(e) => { setEmailAddress(e.target.value) }} />
            <label htmlFor="confirmEmailAddress" >Confirm Email Address</label>
            <input type="email" id="confirmEmailAddress" name="confirmEmailAddress" className="border-1 mb-2 rounded-md" onChange={(e) => { setConfirmEmailAddress(e.target.value) }} />
            {confirmEmailAddressError && (<div className="text-red-500 text-sm">Email addresses must match.</div>)}
            <label htmlFor="message">Message</label>
            <textarea rows={4} id="message" name="message" className="border-1 mb-2 rounded-md" onChange={(e) => setMessage(e.target.value)} />
            <button type="submit" disabled={isSubmitting} className="bg-slate-300 w-fit rounded-md my-2 px-4 py-2 " >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </Form>
    </div>
}