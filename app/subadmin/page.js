"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import style from "./subadmin.module.css";
import Header from "@/public/src/components/AddEventPageComponents/header";
import { useContext, useEffect, useState } from "react";
import AdminDashboardLayout from "@/public/src/GeneralNavComponent";
import Input from "@/public/src/components/manageEventpagecomponents/forminput";
import { Rolecontex } from "@/public/src/components/AdminLoginpageComponents/Admincontex";
import {
  useSubAdmins,
  useCreateSubAdmin,
  useDeleteSubAdmin,
} from "@/app/hooks/useSubAdmin";

const SubAdmin = () => {
  const API = process.env.NEXT_PUBLIC_API;
  const Navigation = useRouter();
  const { Role } = useContext(Rolecontex);
  let [button, setbutton] = useState("subadmin");
  const [subadminfullname, setsubadminfullname] = useState("");
  const [subadminemail, setsubadminemail] = useState("");
  const [subadminpassword, setsubadminpassword] = useState("");
  const [deleteadmin, setdeleteadmin] = useState({});
  const [error, seterror] = useState("");
  const [sucess, setsuccess] = useState("");
  const [loading, setloading] = useState("");
  const [showmodal, setshowmodal] = useState(false);
  const [deleteid, setdeleteid] = useState("");
  const [edit, setedit] = useState(false);

  // React Query hooks
  const { data: subadminData, isLoading, error: queryError } = useSubAdmins();
  const subadmin = subadminData || [];
  const createSubAdminMutation = useCreateSubAdmin();
  const deleteSubAdminMutation = useDeleteSubAdmin();

  useEffect(() => {
    if (queryError) {
      seterror("Error fetching data");
    }
    if (isLoading) {
      setloading(true);
    } else {
      setloading(false);
    }
  }, [queryError, isLoading]);

  const handlelogout = () => {
    Navigation.push("./");
  };

  //to navigate to Attendance marking page once the button is click

  const handledlete = async (deleteid) => {
    setloading(true);
    setdeleteadmin({ ...deleteadmin, [deleteid]: true });

    try {
      await deleteSubAdminMutation.mutateAsync(deleteid);
      setsuccess("Sub-admin deleted successfully");
      setTimeout(() => setsuccess(""), 4000);
    } catch (error) {
      seterror("Unable to delete: " + error.message);
      setsuccess("");
    } finally {
      setloading(false);
      setdeleteadmin({ ...deleteadmin, [deleteid]: false });
    }
  };

  const handleCancleSubAdminCreate = (event) => {
    event.preventDefault();
    setedit(false);
  };

  const handlecreatesubadmin = () => {
    setedit(true);
  };

  const handlesavesubadmin = async (event) => {
    event.preventDefault();
    if (!subadminfullname || !subadminemail || !subadminpassword) {
      seterror("Fill all the necessary details");
      setsuccess("");
      return;
    }

    setloading(true);
    seterror("");

    try {
      await createSubAdminMutation.mutateAsync({
        subadminfullname,
        subadminemail,
        subadminpassword,
      });
      setsuccess("Sub-admin created successfully");
      setsubadminfullname("");
      setsubadminemail("");
      setsubadminpassword("");
      setedit(false);
    } catch (error) {
      seterror(error.response?.data?.Error || "Unable to add admin");
      setsuccess("");
    } finally {
      setloading(false);
    }
  };

  const handleshowmodal = (id) => {
    console.log(id);
    setshowmodal(true);
    setdeleteid(id);
  };

  const confirmdeleteaction = () => {
    handledlete(deleteid);
    setshowmodal(false);
  };

  const modalcancle = () => {
    setshowmodal(false);
  };

  return (
    <div>
      <Header info="Take attendance" />
      <AdminDashboardLayout
        role={Role}
        activeButton={button}
        setActiveButton={setbutton}
      >
        <div className="mb-4 px-1">
          <button
            className="bg-[#7741C3] hover:bg-purple-700 transition-colors rounded-md px-4  text-sm text-white font-medium"
            onClick={handlecreatesubadmin}
          >
            + Create new subadmin
          </button>
        </div>
        <div className="border border-gray-300 mx-1 mb-4 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-bold text-[#7741C3] mb-4">
            Sub-Admin Users
          </h3>
          <div className="flex flex-col gap-3 w-full">
            {subadmin && subadmin.length > 0 ? (
              subadmin.map((info) => (
                <div
                  key={info._id}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Avatar Circle */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {info.sub_admin_user_name?.charAt(0).toUpperCase() || "A"}
                  </div>

                  {/* Admin Info - Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 w-full sm:w-auto">
                    {/* Name */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Admin Name
                      </p>
                      <p className="text-sm font-semibold text-[#7741C3]">
                        {info.sub_admin_user_name}
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-sm font-semibold text-[#7741C3] break-all">
                        {info.sub_admin_email}
                      </p>
                    </div>

                    {/* Join Date (if available) */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Status
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        Active
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleshowmodal(info._id)}
                    disabled={deleteadmin[info._id]}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    title="Delete sub-admin"
                  >
                    {!deleteadmin[info._id] ? (
                      <Image
                        src="./delete.svg"
                        alt="delete"
                        width={18}
                        height={18}
                      />
                    ) : (
                      <span className="text-xs font-bold">...</span>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No sub-admin users created yet
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminDashboardLayout>
      {edit ? (
        <form onSubmit={handlesavesubadmin}>
          <div className={style.modalcontainer}>
            <button
              type="button"
              className={style.canclemodal}
              onClick={handleCancleSubAdminCreate}
            >
              x
            </button>
            <h2 className={style.newadmin}> imag(Create New Sub-Admin)</h2>
            <div>
              <Input
                type="text"
                label="Sub-Admin Full Name"
                value={subadminfullname}
                setValue={setsubadminfullname}
              />
            </div>
            <div>
              <Input
                type="email"
                label="Sub-Admin Email"
                value={subadminemail}
                setValue={setsubadminemail}
              />
            </div>
            <div>
              <Input
                type="password"
                label="Sub-Admin Password"
                value={subadminpassword}
                setValue={setsubadminpassword}
              />
            </div>
            <h2 className={style.password}>
              make the Password to be atleast 8 characters
            </h2>
            <div>
              <button className={style.button1} type="submit">
                create sub-admin
              </button>
              <button
                type="button"
                className={style.button2}
                onClick={handleCancleSubAdminCreate}
              >
                cancle
              </button>
            </div>
          </div>{" "}
        </form>
      ) : (
        ""
      )}
      {showmodal && (
        <div className={style.confirmdelete}>
          <h2 className={style.warning}>
            {" "}
            Are you sure you want to delete this Admin
          </h2>
          <button onClick={confirmdeleteaction} className={style.deletebutton}>
            Yes
          </button>
          <button onClick={modalcancle} className={style.deletebutton}>
            NO
          </button>
        </div>
      )}
    </div>
  );
};

export default SubAdmin;
