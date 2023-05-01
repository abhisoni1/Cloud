import { Component } from "react";


export default function VoicesTable(props){

    const { tableRows } = props;

    // console.log(row);

    return (
        <div>
            <h1>Text to Audio converted results:</h1>
            <table>
                <thead>
                    <tr key="##key##">
                        <th>Input Text</th>
                        <th>Voice</th>
                        <th>Audio</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableRows.map((row) => {
                            return (
                                <>
                                <tr key={row.recordId}>
                                    <td>{row.text}</td>
                                    <td>{row.voice}</td>
                                    <td>
                                        <audio controls>
                                            {/* <source src="horse.ogg" type="audio/ogg"> */}
                                            <source src={row.url} type="audio/mpeg"/>
                                            {/* Your browser does not support the audio element. */}
                                        </audio>
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
    )


}
