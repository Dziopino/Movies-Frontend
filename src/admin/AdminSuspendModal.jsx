import {useRef, useState} from "react";

function AdminSuspendModal({isOpen, onClose, onConfirm}) {

    const [reason, setReason] = useState("");
    const [until, setUntil] = useState("");

    const minDate = new Date().toISOString().slice(0,16);

    if(!isOpen){
        return null;
    }


    const confirmSuspend = (e) => {
        e.preventDefault();
        onConfirm({reason, until});
        setReason("");
        setUntil("");
    };


    return (
        <div className="admin-modal-overlay">
            <form className="admin-modal" onSubmit={confirmSuspend}>
                <h3>Suspend user</h3>

                <label className="mt-3" htmlFor="suspendReason">
                    Suspend reason
                </label>

                <textarea id="suspendReason" className="form-control mt-2" placeholder="Enter suspend reason..." value={reason} onChange={(e)=>setReason(e.target.value)}
                          onKeyDown={(e)=>{
                              if(e.key === "Enter" && !e.shiftKey){
                                  e.preventDefault();
                                  confirmSuspend(e);
                              }
                          }}
                />

                <label className="mt-3" htmlFor="suspendUntil">
                    Suspended until
                </label>

                <input min={minDate} id="suspendUntil" type="datetime-local" className="form-control mt-2" value={until} onChange={(e)=>{setUntil(e.target.value);e.target.blur();}}/>

                <div className="d-flex justify-content-end gap-2 mt-4">

                    <button className="btn btn-secondary" type="button" onClick={onClose}>
                        Cancel
                    </button>


                    <button className="btn btn-warning" type="submit" disabled={!reason.trim() || !until}>
                        Suspend
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AdminSuspendModal;