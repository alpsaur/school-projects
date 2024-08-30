import TextBtn from "./TextBtn.tsx";
import '../css/CategoryList.css'
import {useEffect, useState} from "react"
import Switch from "./SuggestionBtn.tsx";
import {Category as CategoryType} from "../model/Category.ts";
import axiosConfig from "../axiosConfig.tsx";
import {useNavigate} from "react-router-dom";

interface Props{
    onSuggestion?:(checked:boolean)=>void;
    isShowSuggestion:boolean
}
function CategoryList({onSuggestion,isShowSuggestion}:Props){
    const [categoryList, setCategoryList] = useState<CategoryType[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        axiosConfig.get('/categories')
            .then(response => {

                if (Array.isArray(response.data)) {
                    setCategoryList(response.data);
                } else {
                    console.error('Unexpected data format:', response.data);
                    // Handle unexpected data format
                    setCategoryList([]);
                }

            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const onCategoryClick =(categoryId:number)=>{
        navigate(`/category/${categoryId}`)
    }
    return (
        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <ul className="nav nav-justified nav-underline Category-bg mt-4" style={{width: '80%', maxWidth: '1200px'}}>
                {
                    isShowSuggestion &&
                    <li className="nav-item category-height">
                        <Switch onChange={onSuggestion}/>
                    </li>
                }
                {categoryList.map((category, index) => (
                    <li className="nav-item category-height" key={index} onClick={() => onCategoryClick(category.id)}>
                        <TextBtn text={category.name}/>
                    </li>
                ))}

            </ul>
        </div>
    );
}

export default CategoryList