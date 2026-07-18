"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit2, Save, X, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadImagebb } from "@/lib/action/UploadImgbb";

interface LocationItem {
    id: string | number;
    name: string;
    district_id?: string | number;
}

interface UserDataProps {
    _id: string;
    userId: string;
    name: string;
    email: string;
    image: string;
    district: string;
    upazila: string;
    role: string;
    status: string;
}

interface ProfileComponentProps {
    userData: UserDataProps;
}

interface ProfileFormInputs {
    name: string;
    image: FileList | string;
    district: string;
    upazila: string;
}

export default function Profile({ userData }: ProfileComponentProps) {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    const [districts, setDistricts] = useState<LocationItem[]>([]);
    const [upazilas, setUpazilas] = useState<LocationItem[]>([]);

    const {
        register,
        handleSubmit,
        reset: updateForm,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ProfileFormInputs>();

    const selectedDistrictId = watch("district");

    useEffect(() => {
        const initializeProfileData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    fetch("/districts.json"),
                    fetch("/upazilas.json")
                ]);

                const districtData = await districtRes.json();
                const upazilaData = await upazilaRes.json();

                const fetchedDistricts: LocationItem[] = districtData?.[2]?.data || [];
                const fetchedUpazilas: LocationItem[] = upazilaData?.[2]?.data || [];

                setDistricts(fetchedDistricts);
                setUpazilas(fetchedUpazilas);

                if (userData) {
                    const currentDistrictObj = fetchedDistricts.find(d => d.name === userData.district);
                    const currentUpazilaObj = fetchedUpazilas.find(u => u.name === userData.upazila);

                    updateForm({
                        name: userData.name || "",
                        image: userData.image || "",
                        district: currentDistrictObj ? String(currentDistrictObj.id) : "",
                        upazila: currentUpazilaObj ? String(currentUpazilaObj.id) : "",
                    });
                }

                setLoading(false);
            } catch (error) {
                toast.error("Failed to load profile locations.");
                setLoading(false);
            }
        };

        if (userData) {
            initializeProfileData();
        }
    }, [userData, updateForm]);

    const filteredUpazilas = upazilas.filter(
        (upazila) => String(upazila.district_id) === String(selectedDistrictId)
    );

    const onFormSubmit = async (data: ProfileFormInputs) => {
        setSubmitting(true);

        const selectedDistrictObj = districts.find(d => String(d.id) === String(data.district));
        const selectedUpazilaObj = upazilas.find(u => String(u.id) === String(data.upazila));

        let imageUrl = userData?.image || "";

        if (data.image && typeof data.image !== 'string' && data.image.length > 0) {
            try {
                const imageFile = data.image[0];
                const image = await UploadImagebb(imageFile);
                imageUrl = image.url;
            } catch (err) {
                toast.error("Failed to upload new image.");
                setSubmitting(false);
                return;
            }
        }

        const finalPayload = {
            name: data.name,
            image: imageUrl,
            district: selectedDistrictObj ? selectedDistrictObj.name : userData.district,
            upazila: selectedUpazilaObj ? selectedUpazilaObj.name : userData.upazila,
        };

        try {
            const res = await fetch(`${baseurl}/api/own/usercollaction?email=${userData?.email}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalPayload),
            });

            if (res.ok) {
                toast.success('Profile updated successfully!');
                setIsEditable(false);
                router.refresh();
            } else {
                toast.error("Failed to update profile request.");
            }
        } catch (error) {
            toast.error("Error updating profile database");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] shadow-sm mt-7 relative overflow-hidden transition-colors duration-300">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 ring-4 ring-[#f05a28]/10 dark:ring-slate-800">
                        <AvatarImage alt="userimage" src={userData?.image} className="object-cover" />
                        <AvatarFallback className="font-extrabold text-lg bg-[#f05a28]/10 text-[#f05a28] dark:bg-slate-800 dark:text-white">
                            {userData?.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1.5">
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{userData?.name}</h1>
                        <div className="flex gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                                {userData?.role}
                            </span>
                            {userData?.status === "active" ? (
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded">
                                    <CheckCircle className="w-3 h-3" /> {userData?.status}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                                    <ShieldAlert className="w-3 h-3" /> {userData?.status}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    {!isEditable ? (
                        <Button
                            type="button"
                            onClick={() => setIsEditable(true)}
                            className="bg-[#f05a28] text-white hover:bg-[#f05a28]/90 font-bold flex items-center gap-2 rounded-xl px-4 h-10 text-xs shadow-xs transition-all active:scale-[0.98] hover:cursor-pointer"
                        >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit Profile
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => {
                                setIsEditable(false);
                                router.refresh();
                            }}
                            variant="outline"
                            className="border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2 rounded-xl px-4 h-10 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onFormSubmit)}>

                <div className="grid gap-2">
                    <Label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Full Name</Label>
                    <Input
                        disabled={!isEditable}
                        {...register("name", { required: "Name is required" })}
                        placeholder="Enter your full name"
                        className="w-full bg-slate-50/50 dark:bg-slate-800/60 disabled:opacity-70 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all"
                    />
                    {errors.name && <span className="text-xs text-red-500 font-medium pl-1">{errors.name.message}</span>}
                </div>

                <div className="grid gap-2">
                    <Label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Email Address (Locked)</Label>
                    <Input
                        type="email"
                        disabled={true}
                        value={userData?.email || ""}
                        className="w-full bg-slate-100/70 dark:bg-slate-900/80 disabled:opacity-70 border border-slate-200/40 dark:border-slate-800/40 text-slate-400 dark:text-slate-500 text-xs font-medium rounded-xl px-4 py-5 outline-none cursor-not-allowed"
                    />
                </div>

                {/* Profile Image */}
                <div className="grid gap-2">
                    <Label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Profile Image (Optional)</Label>
                    <Input
                        disabled={!isEditable}
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        className="w-full bg-slate-50/50 dark:bg-slate-800/60 disabled:opacity-70 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-2.5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all cursor-pointer file:text-xs file:font-bold file:text-[#f05a28] file:bg-[#f05a28]/10 file:rounded-lg file:border-none file:px-3 file:py-1 file:mr-3"
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* District */}
                    <div className="grid gap-2">
                        <Label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">District</Label>
                        <select
                            disabled={!isEditable}
                            {...register("district", {
                                required: "District is required",
                                onChange: () => {
                                    setValue("upazila", "");
                                }
                            })}
                            className="w-full h-11 bg-slate-50/50 dark:bg-slate-800/60 disabled:opacity-70 disabled:cursor-not-allowed border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] dark:focus:border-[#f05a28] transition-all cursor-pointer"
                        >
                            <option value="">Select district</option>
                            {districts.map((district) => (
                                <option key={district.id} value={String(district.id)} className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && <span className="text-xs text-red-500 font-medium pl-1">{errors.district.message}</span>}
                    </div>

                    {/* Upazila */}
                    <div className="grid gap-2">
                        <Label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Upazila</Label>
                        <select
                            disabled={!isEditable || !selectedDistrictId}
                            {...register("upazila", { required: "Upazila is required" })}
                            className="w-full h-11 bg-slate-50/50 dark:bg-slate-800/60 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] dark:focus:border-[#f05a28] transition-all cursor-pointer"
                        >
                            <option value="">Select upazila</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={String(upazila.id)} className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100">
                                    {upazila.name}
                                </option>
                            ))}
                        </select>
                        {errors.upazila && <span className="text-xs text-red-500 font-medium pl-1">{errors.upazila.message}</span>}
                    </div>
                </div>

                {isEditable && (
                    <div className="flex gap-2 mt-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                        <Button
                            type="submit"
                            className="bg-[#f05a28] hover:bg-[#f05a28]/90 text-white font-bold rounded-xl px-5 h-11 text-xs flex items-center gap-2 transition-all active:scale-[0.98] hover:cursor-pointer"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}