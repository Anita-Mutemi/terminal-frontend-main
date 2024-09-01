// AILists.js
import React, { useState, useEffect } from 'react';
import AIListSidebarItem from './AIListSidebarItem'; // Adjust path as needed
import AIPromptModal from './AIPromptModal'; // Adjust path as needed
import CreatePromptModal from './CreatePromptModal'; // Adjust path as needed
import { useAILists } from '../../../hooks/AIListsDataProvider'; // Adjust path as needed
import { Button } from 'antd';
import CoPilotCard from './CreatePromptModal';
import { useSelector, useDispatch } from 'react-redux';

function AILists() {
	const {
		aiLists,
		fetchAILists,
		createAIList,
		isCreateModalVisible,
		setIsCreateModalVisible,
		selectList,
		deleteAIList,
		updateAIList,
		selectedListId,
	} = useAILists();
	const [selectedList, setSelectedList] = useState(null);
	const [detailedListData, setDetailedListData] = useState(null);

	const { userInfo, access_token } = useSelector((state) => state.user);

	useEffect(() => {
		fetchAILists();
	}, []);

	const handleItemClick = (listId) => {
		selectList(listId); // Sets the selected list ID in context
	};

	const handleCreateNewPrompt = () => {
		setIsCreateModalVisible(true);
	};

	const handleCloseCreateModal = () => {
		setIsCreateModalVisible(false);
	};

	const handleCreateList = (newList) => {
		createAIList(newList);
		handleCloseCreateModal();
	};

	const handleEdit = (list) => {
		setSelectedList(list);
	};

	const handleCloseModal = () => {
		setSelectedList(null);
	};

	const handleDeleteList = (listId) => {
		deleteAIList(listId);
		handleCloseModal();
	};

	const handleUpdateActive = (listId, isActive) => {
		updateAIList(listId, isActive);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				flexDirection: 'column',
			}}>
			<Button
				type='primary'
				onClick={handleCreateNewPrompt}
				style={{ background: '#1cc6a4' }}>
				New Agent
			</Button>
			<br />
			{aiLists.map((list) => (
				<AIListSidebarItem
					key={list.id}
					list={list}
					onEdit={handleEdit}
					onSelect={() => {
						document.querySelector('#agent').click();

						selectList(list.id);
					}}
					isSelected={list.id === selectedListId}
				/>
			))}
			{selectedList && (
				<CoPilotCard
					id={selectedList.id}
					coPilotName={selectedList.name}
					aiModel={selectedList.aiModel} // You will need to make sure these props are provided by `selectedList`
					aiModelImage={selectedList.aiModelImage}
					list={selectedList}
					deploymentDate={selectedList.created_on}
					companiesSinceDeployment={selectedList.projects_count}
					coPilotAuthor={selectedList.author.username}
					thesis={selectedList.prompt}
					access_token={access_token}
					createMode={false}
					onUpdate={(id, updatedData) => {
						handleUpdateActive(id, updatedData);
						fetchAILists();
					}}
					onDelete={() => handleDeleteList(selectedList.id)}
					isVisible={!!selectedList}
					onClose={handleCloseModal}
				/>
			)}
			<CoPilotCard
				isVisible={isCreateModalVisible}
				createMode={true}
				onClose={handleCloseCreateModal}
				onCreate={handleCreateList}
				access_token={access_token}
				coPilotAuthor={userInfo?.username}
			/>
			{/* <CreatePromptModal
				isVisible={isCreateModalVisible}
				onClose={handleCloseCreateModal}
				onCreate={handleCreateList}
			/> */}
		</div>
	);
}

export default AILists;
