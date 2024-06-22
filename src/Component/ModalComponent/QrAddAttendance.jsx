import React from 'react';
import QRCode from 'qrcode.react';
import { useParams } from 'react-router-dom';


const QrAddAttendance = ({ isOpen, onClose })=>{
    const [qrCodeContent, setQRCodeContent] = useState('');
    const { guid_event } = useParams();

    const handleClose = () => {
        onClose();
      };
    
    const handleDetailClick = (guid_event) => {
        setQRCodeContent('http://localhost:5173/'+ guid_event);
        setShowQRCodeModal(true);
      };
    
      const closeQRCodeModal = () => {
        setShowQRCodeModal(false);
        setQRCodeContent('');
      };
    return(
        <>
        <Dialog
            open={isOpen}
            size="sm"
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
        >
            <DialogBody>
                <IoMdClose className="cursor-pointer w-9 h-9 float-end text-black" onClick={handleClose} />
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
                <div className="bg-white p-6 rounded-md w-96">
                    <h2 className="text-lg font-bold mb-4">QR Code</h2>
                    <div className="flex justify-center">
                    <QRCode value={qrCodeContent} size={256} />
                    </div>
                    <div className="flex justify-end mt-4">
                    <button type="button" className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md" onClick={closeQRCodeModal}>
                        Tutup
                    </button>
                    </div>
                </div>
                </div>
            </DialogBody>
        </Dialog>
        </>
    )
}

export default QrAddAttendance;