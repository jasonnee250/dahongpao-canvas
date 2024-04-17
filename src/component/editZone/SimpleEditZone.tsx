import './index.css'
export const SimpleEditZone = () => {

    const value="Rect a x 100,y 100;\n" +
        "Text b x 100,y 100, text \"121212 \n" +
        "121212\n" +
        "121212\",horizonAlign 0,verticalAlign 0;"

    return (<div className="left-zone">
        <textarea className="edit-zone" defaultValue={value}/>
    </div>);
}