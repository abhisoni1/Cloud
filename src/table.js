import './App.css';


export default function VoicesTable(props){

    const { tableRows } = props;

    return <>
    <div className='outputTable'>

        <div className='tablecontainer'>
            {/* <h1>Text to Audio converted results:</h1> */}
            <table classname="table">
                <thead className='thead'>
                    <tr key="##key##" className='trhead'>
                        <th className='th'>Input Text</th>
                        <th className='th'>Translated Text</th>
                        <th className='th'>Voice</th>
                        <th className='th'>Audio</th>
                    </tr>
                </thead>
                <tbody className='tbody'>
                    {
                        tableRows.map((row) => {
                            return (
                                <>
                                <tr key={row.recordId} className='trbody'>
                                    <td className='td'>{row.text}</td>
                                    <td className='td'>{row.translatedText}</td>
                                    <td className='td'>{row.voice}</td>
                                    <td className='td'>
                                        <audio controls src={row.url} type="audio/mpeg" autoPlay></audio>
                                    </td>
                                </tr>
                                
                                </>
                            )
                        })
                    }
                    {/* <tr>
                        <td>Input Text</td>
                        <td>Voice</td>
                        <td>Audio</td>
                        <td>Actions</td>
                    </tr>
                    <tr>
                        <td>Input Text</td>
                        <td>Voice</td>
                        <td>Audio</td>
                        <td>Actions</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    </div>

    </>    


}
