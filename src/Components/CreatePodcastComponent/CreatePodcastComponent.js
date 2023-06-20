import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore/lite';
import { auth, db, storage } from '../../firebase';
import { setAlbum } from '../../slices/AlbumSlice';
import { setIsLoading } from '../../slices/isLoadingSlice';
import FileSelectInput from '../FileSelectInput/FileSelectInput'
import Input from '../Input';
import Button from '../Button/Button';
import defaultAlbum from '../../images/default-album.png'
import pod from '../../images/createPodImg.png';
import { toast } from 'react-toastify';

function CreatePodcastComponent({ setAlbumId, albumName, setAlbumName, albumAbout, setAlbumAbout, fileSelected, setFileSelected, setOpenAlbum, handleOnClickCreatePodcast }) {

    const dispatch = useDispatch();
    const isloading = useSelector(state => state.loading.isloading);

    const onChange = (e) => {
        setFileSelected(e.target.files[0])
    }

    const handleSumit = async (e) => {
        e.preventDefault();
        if (albumName) {

            try {
                dispatch(setIsLoading(true));
                // 1. upload file on firebase and get img link
                let albumImageUrl = defaultAlbum;
                if (fileSelected) {
                    const albumImageRef = ref(
                        storage, `podcasts/${auth.currentUser.uid}/${Date.now()}`
                    );
                    await uploadBytes(albumImageRef, fileSelected);
                    albumImageUrl = await getDownloadURL(albumImageRef);
                }
                // 2. saving album in firebase doc
                const albumData = {
                    albumTitle: albumName,
                    albumDescription: albumAbout,
                    albumImage: albumImageUrl,
                    createdBy: auth.currentUser.uid,
                }
                const docRef = await addDoc(collection(db, 'podcasts'), albumData);
                //3. update current album and update podcast array in redux
                setAlbumId(docRef.id)
                const currentAlbum = {
                    ...albumData,
                    albumId: docRef.id,
                    episode: []
                }
                dispatch(setAlbum(currentAlbum));

                setAlbumName("");
                setAlbumAbout("");
                setFileSelected("");
                dispatch(setIsLoading(false));
                handleOnClickCreatePodcast();
                setOpenAlbum(true);
            } catch (e) {
                dispatch(setIsLoading(false));
                console.log(e);
            }
        } else {
            toast.error("Add Album Name");
        }
    }

    return (
        <div className="create_new_album_container">
            <div className="create_new_album">
                <div className="create_new_album_navbar">
                    <AiOutlineClose cursor={"pointer"} onClick={handleOnClickCreatePodcast} />
                </div>
                <div className="img">
                    <img src={pod} alt="" />
                </div>
                <form>
                    <label htmlFor="albumName">Album's Name</label>
                    <Input type="text" state={albumName} setState={setAlbumName} required={true} name="albumName" placeholder={`album's name`} />
                    <label htmlFor="albumabout">About</label>
                    <Input type="text" state={albumAbout} setState={setAlbumAbout} required={true} name="albumabout" placeholder='About album' />
                    <label htmlFor="albumCover">
                        {fileSelected ? `File ${fileSelected.name} is selected` : "Add cover Image"
                        }</label>
                    <FileSelectInput type="file" accept="image/*" name="albumCover" placeholder="Add File" onChange={onChange} />
                    <Button callback={handleSumit} buttonText={isloading ? "wait..." : "Submit"} type="submit" />
                </form>
            </div>
        </div>
    )
}

export default CreatePodcastComponent
