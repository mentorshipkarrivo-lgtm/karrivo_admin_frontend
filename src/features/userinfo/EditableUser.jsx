// import React, { useState } from 'react';
// import { Pencil } from 'lucide-react';
// import {useUpdateUserInfoMutation} from './userinfoApiSlice';
// const Edituser = ({ user }) => {
//     const [isLoading, setisLoading] = useState(false)
//     const PencilIcon = ({ onClick }) => (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="15"
//             height="15"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="#ec660f"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             style={{ marginLeft: 6, verticalAlign: "middle", cursor: "pointer" }}
//             onClick={onClick}
//         >
//             <path d="M12 20h9" />
//             <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
//             <path d="m15 5 3 3" />
//         </svg>
//     );
//     const handleEditClick = (fieldName) => {
//         console.log(`Editing ${fieldName}`);
//     };
//     const activeStyle = {
//         border: '1px solid #bbb',
//         borderRadius: '4px',
//         opacity: 1,
//     }
//     const disabledInputStyle = {
//         color: '#bbb',
//         background:'#1b242d',
//         opacity: 1,
//         borderRadius: '4px'
//     };

//     return (
//         <div className="modal-body pt-0 px-4">
//             <h2 className="modal-title mb-4" style={{ textAlign: "center", color: '#eb660f' }}>
//                 User Details
//             </h2>
//             {
//                 user && (
//                     <div className="user-details">
//                         <div className="row">
//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Name<PencilIcon onClick={() => alert('You edit this now: Name')} /></label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         value={user.name}
//                                         style={activeStyle}

//                                     />

//                                 </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">User ID</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={user.username}
//                                         disabled
//                                         style={disabledInputStyle}

//                                     // readOnly
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Email<PencilIcon onClick={() => alert('You edit this now: Name')} /></label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={user.email}
//                                         readOnly
//                                         style={activeStyle}

//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Phone<PencilIcon onClick={() => alert('You edit this now: Name')} /></label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={`+${user.countryCode} ${user.phone}`}
//                                         readOnly
//                                         style={activeStyle}

//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Referral Amount</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         //value={user.referenceInr.toFixed(2)}
//                                         value={
//                                             user.countryCode === 91
//                                                 ? `₹${user.referenceInr.toFixed(
//                                                     2
//                                                 )}`
//                                                 : `$${user.referenceInr.toFixed(
//                                                     2
//                                                 )}`
//                                         }

//                                         readOnly
//                                         disabled
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Referrer ID<PencilIcon onClick={() => alert('You edit this now: Name')} /></label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={user.referenceId}
//                                         readOnly
//                                         style={activeStyle}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Tokens</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={user.tokens}
//                                         readOnly
//                                         disabled
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Referral Count</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={user.referenceCount}
//                                         readOnly
//                                         disabled
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Status</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={
//                                             user.isActive ? "Active" : "Inactive"
//                                         }
//                                         readOnly
//                                         disabled
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Created On</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={(
//                                             user.createdAt
//                                         )}
//                                         readOnly
//                                         disabled
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Wallet Amount</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={
//                                             user.countryCode === 91
//                                                 ? `₹${user.walletBalance.toFixed(
//                                                     2
//                                                 )}`
//                                                 : `$${user.walletBalance.toFixed(
//                                                     2
//                                                 )}`
//                                         }
//                                         // value={user.walletBalance}
//                                         readOnly
//                                         disabled
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">Verified</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={
//                                             user.isVerified
//                                                 ? "Verified"
//                                                 : "Not Verified"
//                                         }
//                                         readOnly
//                                         disabled="true"
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form__box">
//                                     <label htmlFor="">KYC Status</label>
//                                     <input
//                                         type="text"
//                                         autoComplete="off"
//                                         className="form-control shadow-none"
//                                         value={
//                                             user.kycStatus === "open"
//                                                 ? "In Open"
//                                                 : user.kycStatus === "approve"
//                                                     ? "Approved"
//                                                     : user.kycStatus === "inprogress"
//                                                         ? "In Progress"
//                                                         : user.kycStatus === "reject"
//                                                             ? "Rejected"
//                                                             : "N/A"
//                                         }
//                                         readOnly
//                                         disabled="true"
//                                         style={disabledInputStyle}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="text-center my-4">
//                         <button
//                           type="button"
//                           className="btn btn-secondary  px-3"
//                           data-bs-dismiss="modal"
//                         >
//                           Close
//                         </button>
//                       </div>
//                     </div>
//                 )
//             }
//             {isLoading && <Skeleton count={5} />}
//         </div >


//     );
// };

// export default Edituser;
import React, { useState, useEffect } from 'react';
import { useUpdateUserInfoMutation } from './userinfoApiSlice';

const Edituser = ({ user }) => {
    const [updateUserInfo, { isLoading: isUpdating }] = useUpdateUserInfoMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState({
        name: false,
        email: false,
        phone: false,
        referenceId: false
    });

    // Create state for editable fields
    const [editedUser, setEditedUser] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: '',
        referenceId: '',
        username: ''
    });

    // Initialize edited values when user prop changes
    useEffect(() => {
        if (user) {
            setEditedUser({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                countryCode: user.countryCode || '',
                referenceId: user.referenceId || '',
                username: user.username || ''
            });
        }
    }, [user]);

    const PencilIcon = ({ onClick }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ec660f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginLeft: 6, verticalAlign: "middle", cursor: "pointer" }}
            onClick={onClick}
        >
            <path d="M12 20h9" />
            <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
            <path d="m15 5 3 3" />
        </svg>
    );

    const handleEditClick = (fieldName) => {
        setEditMode(prev => ({
            ...prev,
            [fieldName]: true
        }));
    };

    const handleInputChange = (e, fieldName) => {
        setEditedUser(prev => ({
            ...prev,
            [fieldName]: e.target.value
        }));
    };

const handleSaveField = async (fieldName) => {
  if (isLoading || isUpdating) return; // Prevent multiple submissions
  
  try {
    setIsLoading(true);
    
    // Prepare data to send to API
    const updateData = {
      username: user.username // Always include username for identification
    };
    
    // Add the field being updated
    if (fieldName === 'phone') {
      updateData.phone = editedUser.phone.replace(/\D/g, '');
      updateData.countryCode = user.countryCode;
    } else {
      updateData[fieldName] = editedUser[fieldName];
    }
    
    console.log('Sending update data:', updateData);
    
    // Call the mutation
    const response = await updateUserInfo(updateData).unwrap();
    console.log('Update response:', response);
    
    if (response && response.success) {
      // Reset edit mode for this field
      setEditMode(prev => ({
        ...prev,
        [fieldName]: false
      }));
      
      // Show success message
      alert(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`);
    } else {
      // Show error message
      alert(`Failed to update ${fieldName}: ${response?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    alert(`Error updating ${fieldName}: ${error.message || 'Unknown error'}`);
  } finally {
    setIsLoading(false);
  }
};

    const activeStyle = {
        border: '1px solid #bbb',
        borderRadius: '4px',
        opacity: 1,
        color: '#bbb',  // Text color for non-editable fields
        background: '#1b242d'
    };

    const editingStyle = {
        border: '1px solid #ec660f',
        borderRadius: '4px',
        opacity: 1,
        background: '#1b242d',
        color: '#ffffff',  // White text for better visibility when editing
        fontWeight: '500'  // Slightly bolder text when editing
    };

    const disabledInputStyle = {
        color: '#bbb',
        background: '#1b242d',
        opacity: 1,
        borderRadius: '4px'
    };

    // Custom button style to ensure text visibility
    const saveButtonStyle = {
        backgroundColor: '#ec660f',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 15px',
        fontWeight: 'bold',
        cursor: 'pointer'
    };

    const renderEditableField = (fieldName, label, value) => {
        return (
            <div className="form__box">
                <label htmlFor="">{label}
                    {!editMode[fieldName] &&
                        <PencilIcon onClick={() => handleEditClick(fieldName)} />
                    }
                </label>
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control"
                        value={editMode[fieldName] ? editedUser[fieldName] : value}
                        onChange={(e) => handleInputChange(e, fieldName)}
                        readOnly={!editMode[fieldName]}
                        style={editMode[fieldName] ? editingStyle : activeStyle}
                    />
                    {editMode[fieldName] && (
                        <button
                            className="ms-2"
                            onClick={() => handleSaveField(fieldName)}
                            disabled={isUpdating || isLoading}
                            style={saveButtonStyle}
                        >
                            {(isUpdating || isLoading) ? (
                                
                                   `Saving...`
                               
                            ) : 'Save'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Handle phone separately due to country code
    const renderPhoneField = () => {
        const phoneDisplay = `+${user.countryCode} ${user.phone}`;

        return (
            <div className="form__box">
                <label htmlFor="">Phone
                    {!editMode.phone &&
                        <PencilIcon onClick={() => handleEditClick('phone')} />
                    }
                </label>
                <div className="d-flex">
                    {editMode.phone ? (
                        <>
                            <input
                                type="text"
                                className="form-control"
                                value={editedUser.phone}
                                onChange={(e) => handleInputChange(e, 'phone')}
                                style={editingStyle}
                                placeholder="Phone number without country code"
                            />
                            <button
                                className="ms-2"
                                onClick={() => handleSaveField('phone')}
                                disabled={isUpdating || isLoading}
                                style={saveButtonStyle}
                            >
                                {(isUpdating || isLoading) ? 'Saving...' : 'Save'}
                            </button>
                        </>
                    ) : (
                        <input
                            type="text"
                            className="form-control"
                            value={phoneDisplay}
                            readOnly
                            style={activeStyle}
                        />
                    )}
                </div>
            </div>
        );
    };

    // If user data is not available yet, show loading
    if (!user) {
        return <div className="modal-body pt-0 px-4">Loading user details...</div>;
    }

    return (
        <div className="modal-body pt-0 px-4">
            <h2 className="modal-title mb-4" style={{ textAlign: "center", color: '#eb660f' }}>
                User Details
            </h2>
            <div className="user-details">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        {renderEditableField('name', 'Name', user.name)}
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">User ID</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={user.username}
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        {renderEditableField('email', 'Email', user.email)}
                    </div>

                    <div className="col-md-6 mb-3">
                        {renderPhoneField()}
                    </div>

                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Referral Amount</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={
                                    user.countryCode === 91
                                        ? `₹${user.referenceInr.toFixed(2)}`
                                        : `$${user.referenceInr.toFixed(2)}`
                                }
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        {renderEditableField('referenceId', 'Referrer ID', user.referenceId)}
                    </div>

                    {/* Rest of the fields remain the same */}
                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Tokens</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={user.tokens}
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Referral Count</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={user.referenceCount}
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Status</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={user.isActive ? "Active" : "Inactive"}
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Created On</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={user.createdAt}
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Wallet Amount</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={
                                    user.countryCode === 91
                                        ? `₹${user.walletBalance.toFixed(2)}`
                                        : `$${user.walletBalance.toFixed(2)}`
                                }
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">Verified</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={user.isVerified ? "Verified" : "Not Verified"}
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form__box">
                            <label htmlFor="">KYC Status</label>
                            <input
                                type="text"
                                autoComplete="off"
                                className="form-control shadow-none"
                                value={
                                    user.kycStatus === "open"
                                        ? "In Open"
                                        : user.kycStatus === "approve"
                                            ? "Approved"
                                            : user.kycStatus === "inprogress"
                                                ? "In Progress"
                                                : user.kycStatus === "reject"
                                                    ? "Rejected"
                                                    : "N/A"
                                }
                                readOnly
                                disabled
                                style={disabledInputStyle}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="text-center my-4">
                    <button
                        type="button"
                        className="btn btn-secondary px-3"
                        data-bs-dismiss="modal"
                    >
                        Close
                    </button>
                </div> */}
            </div>
            {/* {isLoading && <div className="overlay-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>} */}
        </div>
    );
};

export default Edituser;