import { useContext } from 'react';
import ItemCard from '../../components/item-card/item-card.component';
import { CategoriesContext } from '../../contexts/categories.context';
import '../../components/item-grid/item-grid.styles.css'

const Prints = () => {
    const { prints } = useContext(CategoriesContext);
    console.log(prints);
    return(
        <div className='main-container'>
            <div className='item-grid'>
                {prints.map((print) => (
                    <ItemCard key={print.id} product={print}></ItemCard>
                ))}
            </div>
        </div>
    )

}
export default Prints;