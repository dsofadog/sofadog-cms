import { useEffect, useState } from "react";
import Actions from "component/common/Actions";
import Owners from "component/common/Owners";
import NewsItemHeaderSection from "component/common/NewsItemHeaderSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTimeout } from 'rooks'

type Props = {
  newsItem: any;
  onEdit: ()=>void
}

const PreviewItemTable = (props: Props) => {

  const {newsItem, onEdit} = props

  const [loadingThumbnails, setLoadingThumbnails] = useState<boolean>(false)
  const { start: fastStopLoadingThumbnails } = useTimeout(() => setLoadingThumbnails(false), 1000)
  const { start: slowStopLoadingThumbnails } = useTimeout(() => setLoadingThumbnails(false), 4000)

  useEffect(() => {
    if (newsItem?.loading) {
      setLoadingThumbnails(true)
    }
    if (!newsItem?.loading && newsItem?.state === 'transcoding') {
      slowStopLoadingThumbnails()
    } else if (!newsItem?.loading && newsItem?.state !== 'transcoding') {
      fastStopLoadingThumbnails()
    }
  }, [newsItem?.loading])

  return (
    <>
      <tr className="bg-white">
        <td className="pl-6 pr-3 py-4 whitespace-nowrap text-xs font-medium text-gray-900">
          {newsItem?.ordinal}
        </td>
        <td className="px-3 py-4 text-xs font-medium text-gray-900">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              {loadingThumbnails && <FontAwesomeIcon className="w-12 h-12 p-2 rounded-full text-gray-200" icon={['fas', 'spinner']} spin />}

              {!loadingThumbnails && (newsItem?.thumbnails[0] && newsItem?.thumbnails[0].url
                ? <img className="h-10 w-10 rounded-full" src={newsItem?.thumbnails[0].url} alt="" />
                : <span className="inline-flex items-center justify-center h-10 w-10 rounded-full sfd-btn-primary">
                  <span className="text-lg font-medium leading-none text-white">N</span>
                </span>)}
            </div>
            <div className="ml-4">
              <NewsItemHeaderSection compressed={true} newsItem={newsItem} />
            </div>
          </div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
          <Owners newsItem={newsItem} />
        </td>
        <td className="pl-3 pr-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <span className="flex">
            <span className="flex-1">
              <Actions onEdit={onEdit} newsItem={newsItem} />
            </span>
          </span>
        </td>
      </tr>
    </>
  );
};

export default PreviewItemTable;
