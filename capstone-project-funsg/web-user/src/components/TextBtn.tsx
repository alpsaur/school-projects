
interface Props{
    text:string;
    className?:string
}

function TextBtn(props:Props){
    return (
        <a className={"nav-link fw-medium text-black "+props.className} aria-current="page">{props.text}</a>
    )
}

export default TextBtn