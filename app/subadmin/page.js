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
      />
      <div className="pl-[58%] lg:pl-[86%] mt-1 mb-4 px-3">
        <button
          className="bg-[#7741C3] rounded-md px-2 py-1 text-sm w-1xl"
          onClick={handlecreatesubadmin}
        >
          Create new subadmin
        </button>
      </div>
      <div className="my-1 pt-1 mx-4 rounded-sm bg-white pl-2 border-solid-1 rgba=[0,0,0,0.4] ">
        <div className="flex justify-between ml-2 mr-5 text-[#7741C3]  solid rgba=[0,0,0,]">
          <span>Admin</span>
          <span>Email</span>
          <span>Delete</span>
        </div>
        <hr className={style.hr} />
        <div>
          {" "}
          {subadmin.map((info) => (
            <div key={info._id} className={style.headercontainer1}>
              <span>{info.sub_admin_user_name}</span>
              <span>{info.sub_admin_email}</span>
              <span>
                {!deleteadmin[info._id] ? (
                  <Image
                    src="./delete.svg"
                    alt=""
                    width={10}
                    height={10}
                    onClick={() => handleshowmodal(info._id)}
                    className={style.delete}
                  />
                ) : (
                  "wait..."
                )}
              </span>{" "}
            </div>
          ))}
        </div>
      </div>
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
