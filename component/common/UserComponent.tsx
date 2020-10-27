
import { config as f_config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { useEffect, useRef, useState } from 'react';
import UserInfo from './UserInfo';

f_config.autoAddCss = false;
library.add(fas, fab, far);

const UserComponent = () => {

	const [addNew,setAddNew] = useState(false);
	const toggleAddNew = () => { setAddNew(!addNew) };

	return (
		<div className="pt-2 pb-6 md:py-6 min-h-3/4">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="w-full flex">
					<div className="w-1/2">
						<h1 className="text-2xl font-semibold text-gray-900">Users</h1>
					</div>
					<div className="w-1/2 flex justify-end">
						<button onClick={toggleAddNew} className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm">+ Add User</button>
					</div>
				</div>
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
				<div className="py-4 min-h-96">
					<div className="bg-white shadow overflow-hidden sm:rounded-md">
						<ul>
							{addNew &&(
								<UserInfo action="add" callback={toggleAddNew}></UserInfo>
							)}							
							<UserInfo action="view"></UserInfo>
							<UserInfo action="view"></UserInfo>
							<UserInfo action="view"></UserInfo>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserComponent