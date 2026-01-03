export interface Competition {
    name: string;
    rank: string;
    date?: string;
}

export interface Experience {
    institution: string;
    duration: string;
    description: string;
    role?: string;
    order: number;
}

export interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    otp: string;
    department: string;
    city: string | null;
    bio: string;
    skills: string[];
    experiences: Experience[];
    competitions: Competition[];
    certificates: string[];
    profileImage?: string | null;
}