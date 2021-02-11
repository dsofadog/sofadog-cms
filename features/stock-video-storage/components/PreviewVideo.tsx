import _ from 'lodash'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { ConfirmationContext } from 'contexts'
import { remove } from 'features/stock-video-storage/slices/stock-video-storage.slice'
import { useDispatch } from 'react-redux'

type Props = {
    video: any;
    onViewClick: () => void
}
const PreviewVideo = (props: Props) => {

    const { video, onViewClick } = props
    const dispatch = useDispatch()
    const confirm = useContext(ConfirmationContext)

    return (<>
        <li>
            <div className="space-y-2">

                <div className="aspect-w-3 aspect-h-2 cursor-pointer" onClick={onViewClick}>
                    {/* <img className="object-cover shadow-lg rounded-lg" src={video.thumbnail} alt="" /> */}
                    <video preload="metadata" style={{
                        backgroundColor: 'black'
                    }} src={video.url+'#t=0.1'} />
                </div>
                <div className="flex justify-between items-center">
                    <span className="mr-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                        {moment.unix(video.created_at).format('ll')}
                    </span>
                    <div>
                        <button
                            onClick={() => {
                                window.open(video.url, '_blank')
                            }}
                            type="button" className="mr-1 inline-flex items-center px-1 py-1 text-gray-500 border border-gray-300 bg-white hover:bg-gray-100 rounded-md text-xs">
                            <FontAwesomeIcon className={`h-3 w-3 mr-2 text-gray-300`} icon={['fas', 'file-download']} />
                            <span>Download</span>
                        </button>
                        <button
                            onClick={() => {
                                confirm({
                                    variant: 'danger'
                                }).then(() => {
                                    dispatch(remove(video.id))
                                })
                            }}
                            type="button"
                            disabled={video.loading}
                            className={(video.loading ? 'cursor-not-allowed disabled:opacity-50 ' : '') + 'inline-flex items-center px-1 py-1 text-gray-500 border border-gray-300 bg-white hover:bg-gray-100 rounded-md text-xs'}>
                            {!video.loading && <FontAwesomeIcon className={`h-3 w-3 mr-2 text-gray-300`} icon={['fas', 'trash']} />}
                            {video.loading && <FontAwesomeIcon className="animate-spin h-3 w-3 mr-2" icon={['fas', 'spinner']} />}
                            <span>{video.loading ? 'Processing' : 'Remove'}</span>
                        </button>
                    </div>

                </div>
                <div className="space-y-2">

                    <div className="text-lg leading-6 font-medium space-y-1">
                        {video.tags.map((tag, index) => {
                            return (<span key={index} className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                {tag}
                            </span>)
                        })
                        }
                    </div>

                </div>
            </div>
        </li>
    </>)
}

export default PreviewVideo