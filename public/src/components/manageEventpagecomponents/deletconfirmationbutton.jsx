import style from "./deleteconfirmation.module.css"

const Deleteconfirmation=({id, showmodal ,setshowmodal, handledeletevent})=>{
    setshowmodal(true)
   return(
    <div>
    { showmodal?<div>
      <h1> are you sure you want to delete</h1>
        <button onClick={()=>handledeletevent(id)} className={style.yes}> Yes </button>
        <button onClick={setshowmodal(false)} className={style.yes}> No</button>
    </div>:null}
    </div>
   )
}

export default Deleteconfirmation