import CategoryList from "./CategoryList";

type Props = {
    feed: any;
}

const Feed = (props: Props) => {

    const { feed } = props

    return (
        <>
            <CategoryList categories={feed.categories}/>
        </>

    )
}

export default Feed