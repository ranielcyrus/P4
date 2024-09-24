import axios from 'axios';
import { useEffect, useState } from 'react'; 
import './Home.css'
import logo from '../assets/Logo.png'
import chicken from '../assets/chickenSound.mp3'

export const Home = () => {
    const [data, setData] = useState([]);
    const [title, setTitle] = useState();
    const [contents, setContents] = useState();
    const [editingId, setEditingId] = useState(null); 

    console.log(data);

    useEffect(() => {
        const fetchUsers = async () => {

            try {
                const response = await axios.get('https://p4-c8q1.onrender.com/datas')
                setData(response.data.results);
            } catch (error) {
                console.error('Error details:', error);
            }
        }

        fetchUsers();
    }, [])

    const testSound = async () => {
        const testAudio = new Audio(chicken);
        testAudio.play().catch(error => console.error('Error playing sound:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        testSound();

        setTimeout(() => {
            const userObj = {
                data_title: title,
                data_contents: contents
            }
    
            if (editingId) {
                // Update existing item
                axios.patch(`https://p4-c8q1.onrender.com/data/${editingId}`, userObj)
                    .then(response => {
                        console.log(response);
                        resetForm();
                    })
                    .catch(() => console.log('Error in updating user'));
            } else {
                // Create new item
                axios.post('https://p4-c8q1.onrender.com/data', userObj)
                    .then(response => {
                        console.log(response);
                        resetForm();
                    })
                    .catch(() => console.log('Error in creating a new user'));
            }

            window.location.reload();
          }, 3000);
       
    }

    const handleDelete = (id) => {
        axios.delete(`https://p4-c8q1.onrender.com/data/${id}`)
            .then(response => console.log(response))
            .catch(error => console.error('Error deleting user:', error));
        
        window.location.reload();
    };

    const handleEdit = (id, currentTitle, currentContents) => {
        setEditingId(id);
        setTitle(currentTitle);
        setContents(currentContents);
    };

    return (
        <>
            <section className='home-section'>
                <div>      
                    <img src={logo} alt='logo' width={150} height={150}/>
                    <h2>Twitter Clone</h2>
                    <form onSubmit={handleSubmit}>
                        <div id='labels-fields'>
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={title}
                                required
                                onChange={e => setTitle(e.target.value)}
                            />
                            <label>Content</label>
                            <textarea 
                                required 
                                className='w-96'
                                value={contents}
                                onChange={e => setContents(e.target.value)}
                                ></textarea>
                        </div>
                        <div id='submit-btn-wrapper'>
                            <button type='submit'>Submit</button>
                        </div>
                    </form>

                    {/* showing datas from database */}
                    {
                        data.map(fetchedData => {
                            return (
                                <div key={fetchedData._id} className='m-2 border-solid border-black border-2 rounded-md p-5 w-96'>
                                    <div className=''>
                                        <h2  className='text-center m-2'>{fetchedData.data_title}</h2> 
                                        <h3  className='text-center'>{fetchedData.data_contents}</h3> 
                                    </div>
                                    <div className='text-center'>
                                        <button className='m-2 p-1.5 rounded-lg' 
                                        onClick={() => handleEdit(fetchedData._id, fetchedData.data_title, fetchedData.data_contents)}>edit</button>
                                        <button className='m-2 p-1.5 rounded-lg' onClick={() => handleDelete(fetchedData._id)}>delete</button>
                                    </div>
                                </div>
                            )
                        })
                    }

                    
                    <div className='flex justify-center mt-12'>
                        <p>&copy; Raniel Cyrus Echon</p>
                    </div>

                </div>
            </section>
        </>
    )
}