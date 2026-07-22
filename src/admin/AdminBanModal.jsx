import {useState} from "react";

function AdminBanModal({isOpen, onClose, onConfirm}) {

    const [reason, setReason] = useState("");

    if(!isOpen){
        return null;
    }


    const confirmBan = (e) => {
        e.preventDefault();
        onConfirm(reason);
        setReason("");
    };


    return (
        <div className="admin-modal-overlay">
            <form className="admin-modal" onSubmit={confirmBan}>
                <h3>Ban user</h3>

                <label className="mt-3" htmlFor="banReason">
                    Ban reason
                </label>

                <textarea id="banReason" className="form-control mt-2" placeholder="Enter ban reason..." value={reason} onChange={(e)=>setReason(e.target.value)}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter" && !e.shiftKey){
                            e.preventDefault();
                            confirmBan(e);
                        }
                    }}
                />

                <div className="d-flex justify-content-end gap-2 mt-4">

                    <button className="btn btn-secondary" type="button" onClick={onClose}>
                        Cancel
                    </button>

                    <button className="btn btn-danger" type="submit" disabled={!reason.trim()}>
                        Ban
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AdminBanModal;