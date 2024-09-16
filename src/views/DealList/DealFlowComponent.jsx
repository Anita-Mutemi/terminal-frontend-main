import React, { useEffect, useState, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import Project from './Project';
import { BsStars } from 'react-icons/bs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Oval } from 'react-loader-spinner';
// import ActionsDial from '../../components/ActionsDial';
import useDealFlowData from './useDealFlowData';
import FeedEnd from '../../UI/FeedEnd';
import { GeneralErrorBoundary } from '../../UI/Errors/GeneralErrorBoundary';
import { Form, Button } from 'antd';
import logo from '../../assets/logo-gray.png';
import { Result } from 'antd';

import {
	FolderAddOutlined,
	AppstoreAddOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import { set } from 'lodash';

const DealFlowWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.1rem;
	height: 50%;
	min-height: 84vh;
	margin-top: 0.5rem;
	overflow-x: hidden;
	border-radius: 5px;
	/* background: red; */
`;
const DealFlowContainer = styled.div`
	width: 100%;
	/* max-height: 35rem; */
	height: 90%;
	flex-direction: column;
	/* background: ${({ theme }) => theme.body}; */
	background: ${({ theme }) => theme.background};
	gap: 1rem;
	overflow-y: auto;
	::-webkit-scrollbar {
		width: 9.5px;
		height: 2.5px;
		margin-top: 3rem;
	}
	::-webkit-scrollbar-track {
		box-shadow: none;
		margin-top: 1rem;
		margin-bottom: 0.8rem;
		/* border: 1px solid #878990; */
		border-radius: 1.5px;
		margin-top: 3rem;
	}
	::-webkit-scrollbar-thumb {
	}
	overflow-x: hidden;
`;

export const DealFlowComponent = ({
	showBanner = true,
	width = 100,
	uuid = 'b8a50afb-b78c-4edc-8850-f69c7cec3056',
	list = false,
}) => {
	const [selectedFilters, setSelectedFilters] = useState([]); // State to hold selected filters
	const [form] = Form.useForm();

	const {
		data,
		filters,
		loading,
		hasMore,
		searchQuery,
		inputRef,
		setIsCreateModalVisible,
		setSearchQuery,
		isFiltered,
		createAIList,
		applyFilters,
		clearFilters,
	} = useDealFlowData('b8a50afb-b78c-4edc-8850-f69c7cec3056', form);

	const theme = useTheme();

	const [isClearButtonEnabled, setIsClearButtonEnabled] = useState(false);

	const [expandedSectionId, setExpandedSectionId] = useState('');

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleSubmit = useCallback(() => {
		// Get all form values
		const values = form.getFieldsValue();
		const selectedFilters = Object.entries(values)
			.map(([key, value]) => ({
				tag_type: key,
				tag_names: value ? [value] : [],
			}))
			.filter((filter) => filter.tag_names.length > 0);
		setSelectedFilters(selectedFilters);

		applyFilters(searchQuery, selectedFilters, true, true);
	}, [searchQuery, form, applyFilters]);

	// Function to determine if the "Clear All" button should be enabled
	const checkClearButtonState = () => {
		const formValues = form.getFieldsValue();
		const isAnyFormFieldFilled = Object.values(formValues).some(
			(value) => value,
		);
		return isAnyFormFieldFilled || searchQuery;
	};

	// Update the clear button state when form fields or search query change
	useEffect(() => {
		setIsClearButtonEnabled(checkClearButtonState());
	}, [form, searchQuery]);

	const handleCommentExpand = (id) => {
		if (id === expandedSectionId) {
			setExpandedSectionId('');
			return;
		}
		setExpandedSectionId(id);
		return;
	};

	const fetchMoreData = useCallback(() => {
		if (loading || !hasMore) return;
		if (isFiltered) {
			applyFilters(searchQuery, selectedFilters, false, false);
		} else {
			applyFilters('', selectedFilters, false, false); // Passing empty search query and filters for unfiltered data
		}
	}, [
		loading,
		hasMore,
		isFiltered,
		searchQuery,
		selectedFilters,
		applyFilters,
	]);

	const fund = {
		title: 'Wil',
		logo: 'https://global-uploads.webflow.com/629b57a8eb19ac329e25470f/637281d9c1d21733b9b75aef_wil_logo-dots.8380b8cb.svg',
		confidence: 'high',
	};

	const toReadablePlaceholder = (str) => {
		const newStr = str
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		return newStr;
	};

	return (
		<DealFlowWrapper>
			{data?.length > 0 && !loading ? (
				<DealFlowContainer
					id='DealFlow'
					width={width}>
					<InfiniteScroll
						dataLength={500}
						next={fetchMoreData}
						hasMore={false}
						scrollableTarget='DealFlow'
						endMessage={<FeedEnd ticker={true} />}
						loader={
							<Oval
								height={50}
								width={50}
								color='#484848'
								wrapperStyle={{
									display: 'flex',
									justifyContent: 'center',
									width: '100%',
								}}
								wrapperClass=''
								visible={true}
								ariaLabel='oval-loading'
								secondaryColor='#222222'
								strokeWidth={2}
								strokeWidthSecondary={2}
							/>
						}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1.05rem',
							overflow: 'hidden',
							width: '100%',
							background: theme.body,
							paddingTop: '0.5rem',
						}}>
						{data.map((project) => (
							<GeneralErrorBoundary
								customMessage={`Could not load the project ${
									project?.title ?? ''
								}`}>
								<Project
									key={project.uuid}
									uuid={project.uuid}
									info={project}
									newSignal={false}
									title={project.title}
									expandedSectionId={expandedSectionId}
									handleCommentExpand={handleCommentExpand}
									verticals={project.verticals}
									triggerPopUp={() => {
										return false;
									}}
									logo={project.logo}
									investor={fund}
								/>
							</GeneralErrorBoundary>
						))}
					</InfiniteScroll>
				</DealFlowContainer>
			) : loading ? (
				<div
					style={{
						width: '100%',
						borderRadius: '5.4px',
						height: '100%',
						minHeight: '83.5vh',
						background: theme.body,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}>
					<img
						src={logo}
						alt='logo'
						style={{
							position: 'absolute',
							width: '4.85rem',
							opacity: 0.1,
							left: '50%',
							top: '32%',
							transform: 'translate(-50%, -50%)',
						}}
					/>
					<h3
						style={{
							opacity: 0.11,
							fontSize: '42px',
							position: 'absolute',
							left: '50%',
							top: '46%',
							pointerEvents: 'none',
							transform: 'translate(-50%,-50%)',
						}}>
						TWOTENSOR.COM
					</h3>
					<Oval
						height={50}
						width={50}
						color='#484848'
						wrapperStyle={{}}
						wrapperClass=''
						visible={true}
						ariaLabel='oval-loading'
						secondaryColor='#222222'
						strokeWidth={2}
						strokeWidthSecondary={2}
					/>
				</div>
			) : data?.length === 0 ? (
				<DealFlowContainer
					id='DealFlow'
					style={{ padding: '1.5rem' }}>
					<Result
						icon={<InfoCircleOutlined style={{ color: 'rgb(28, 198, 164)' }} />}
						title={<h3 style={{ color: theme.text }}>No Projects Found</h3>}
						subTitle={
							<p style={{ color: theme.subText }}>
								Please wait for a while until projects appear or change the
								prompt as it might be too specific
							</p>
						}
					/>
				</DealFlowContainer>
			) : (
				<DealFlowContainer
					id='DealFlow'
					style={{ padding: '1.5rem' }}>
					<Result
						icon={
							<BsStars
								style={{
									width: '7rem',
									height: '4rem',
									color: 'rgb(28, 198, 164)',
								}}
							/>
						}
						title={<h3 style={{ color: theme.text }}>Deploy your Agent</h3>}
						extra={
							<Button
								type='primary'
								key='console'
								onClick={() => setIsCreateModalVisible(true)}
								style={{ background: 'rgb(28, 198, 164)' }}>
								Deploy New Agent
							</Button>
						}
					/>
				</DealFlowContainer>
			)}
			{/* <ActionsDial /> */}
		</DealFlowWrapper>
	);
};
