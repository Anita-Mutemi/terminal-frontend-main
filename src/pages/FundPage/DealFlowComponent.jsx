import { useEffect, useState, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import Project from './Project';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Oval } from 'react-loader-spinner';
// import ActionsDial from '../../components/ActionsDial';
import useDealFlowData from './hooks/useDealFlowData';
import FeedEnd from '../../UI/FeedEnd';
import { GeneralErrorBoundary } from '../../UI/Errors/GeneralErrorBoundary';
import { Form, Select, Button } from 'antd';
import logo from '../../assets/logo-gray.png';
import {
	RightOutlined,
	InfoCircleOutlined,
	CloseCircleOutlined,
	SearchOutlined,
	PlusOutlined,
	ExportOutlined,
	ProjectOutlined,
} from '@ant-design/icons';
import { Input, Tooltip } from 'antd';

const DealFlowWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.1rem;
	min-height: 74vh;
	overflow-x: hidden;
	border-radius: 5px;
	padding-bottom: 2.5rem;
	background: ${({ theme }) => theme.background};
`;

const ShortcutIndicator = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => theme.subText};
	display: flex;
	position: absolute;
	font-size: 0.72rem;
	align-items: center;
	justify-content: center;
	text-align: center;
	right: 1rem;
	/* background-color: ${({ theme, active }) =>
		active ? '#2a4862' : theme.searchBar}; */
	cursor: pointer;
	text-decoration: none;
	border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
	border-radius: 5px;
	height: 0.8em;
	padding: 5px 5px;
`;

const StyledSelect = styled(Select)`
	.ant-select-selector {
		background: ${(props) => props.addonBg} !important;
		color: ${(props) => props.textColor} !important;
		border-color: ${({ theme }) => theme.borderColor} !important;
	}
	.ant-select-selection-placeholder {
		color: ${(props) => props.textColor};
	}
	&:disabled .ant-select-selection-placeholder {
		color: ${(props) => props.textColor};
	}

	.ant-select-arrow {
		color: ${({ theme }) => theme.borderColor} !important;
		fill: ${({ theme }) => theme.borderColor} !important;
	}
`;

const StyledButton = styled(Button)`
	background: ${({ theme }) => theme.background};
	position: relative;
	border-color: ${({ theme }) => theme.borderColor};
	color: ${({ theme }) => theme.text};

	&:hover {
		border-color: #40e0d0 !important;
		color: #40e0d0 !important;
	}
	&:disabled {
		color: ${({ theme }) => theme.borderColor};
		border-color: ${({ theme }) => theme.borderColor};
	}
`;

const StyledInput = styled(Input)`
	&.ant-input {
		background: ${(props) => props.addonBg} !important;
		color: ${(props) => props.textColor} !important;
		border-color: ${({ theme }) => theme.borderColor} !important;

		&::placeholder {
			color: ${(props) => props.textColor} !important;
		}
		.ant-input: placeholder-shown {
			color: ${(props) => props.textColor} !important;
		}
	}
	:where(.css-dev-only-do-not-override-txh9fw).ant-input-affix-wrapper {
		background: ${(props) => props.addonBg} !important;
		color: ${(props) => props.textColor} !important;
		border-color: ${({ theme }) => theme.borderColor} !important;
		&::placeholder {
			color: ${(props) => props.textColor} !important;
		}
	}

	&::placeholder {
		color: ${(props) => props.textColor} !important;
	}

	.ant-input {
		background: ${(props) => props.addonBg} !important;
		color: ${(props) => props.textColor} !important;
		border-color: ${({ theme }) => theme.borderColor} !important;
		&::placeholder {
			color: ${(props) => props.textColor} !important;
		}
	}
	.ant-input:placeholder {
		color: ${(props) => props.textColor} !important;
	}
	.ant-input-affix-wrapper {
		background: ${(props) => props.addonBg} !important;
		border-color: ${({ theme }) => theme.borderColor} !important;

		&::placeholder {
			color: ${(props) => props.textColor} !important;
		}
	}
	&:disabled .ant-select-selection-placeholder {
		color: ${(props) => props.textColor};
	}
	.ant-select-arrow {
		color: ${({ theme }) => theme.borderColor} !important;
		fill: ${({ theme }) => theme.borderColor} !important;
	}
`;

const DealFlowContainer = styled.div`
	width: 95%;
	/* max-height: 35rem; */
	height: 100%;
	flex-direction: column;
	/* background: ${({ theme }) => theme.body}; */
	padding-right: 0.65rem;
	margin-right: -0.5rem;
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
	width = 98,
	uuid,
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
		setSearchQuery,
		isFiltered,
		applyFilters,
		clearFilters,
	} = useDealFlowData(uuid, form);

	const theme = useTheme();
	console.log(data);
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
			<style>
				{`
          .infinite-scroll-component__outerdiv {
            width: 100% !important;
            display:flex !important;
            padding:1.5rem;
            justify-content: center!important;
            padding-top:0rem;
            /* ...whatever more styles you want */
          }
          .ant-input-affix-wrapper{
            background:${theme.background} !important;
            border-color:${theme.borderColor} !important;
          }
          .ant-input {
            border-color:${theme.borderColor} !important;
            background:${theme.background} !important;
          `}
			</style>
			<div
				style={{
					width: '100%',
					// borderBottom: `1px solid ${theme.borderColor}`,
				}}>
				<div
					style={{
						padding: '2.5rem',
						paddingLeft: '2.5rem',
						paddingBottom: '2rem',
						display: 'flex',
						width: '95%',
						justifyContent: 'space-between',
					}}>
					<div
						style={{
							display: 'flex',
							gap: '0.95rem',
							alignItems: 'center',
						}}>
						<div
							style={{
								height: '40px',
								width: '40px',
								background: 'rgb(64, 224, 208)',
								color: theme.body,
								borderRadius: '100%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								color='inherit'
								viewBox='0 0 12 12'
								width='20'>
								<path
									fill='inherit'
									stroke='currentColor'
									d='M2.5.5v8h9v-6h-5L4.9.5H2.5Z'></path>
								<path
									stroke='currentColor'
									d='M.5 2v8.5H10'></path>
							</svg>
						</div>
						<div>
							<h1 style={{ fontSize: '1.8em', fontWeight: '400' }}>
								Deal Flow
							</h1>
							<p style={{ color: theme.subText }}>
								Access historic intent data specific to this data source.
							</p>
						</div>
					</div>
					{/* <div style={{ display: 'flex', gap: '0.4rem', alignSelf: 'end' }}>
            <StyledButton
              variant='outlined'
              icon={
                <ProjectOutlined
                  style={{
                    transform: 'scale(0.85)',
                    paddingRight: '0.2rem',
                    color: theme.subBackgroundColor,
                  }}
                />
              }
              disabled={true}
            >
              My dealflow
            </StyledButton>
            <StyledButton
              variant='outlined'
              icon={
                <PlusOutlined
                  style={{
                    transform: 'scale(0.85)',
                    paddingRight: '0.2rem',
                    color: theme.subBackgroundColor,
                  }}
                />
              }
              disabled={true}
            >
              Save
            </StyledButton>
            <StyledButton
              icon={
                <ExportOutlined
                  style={{
                    transform: 'scale(0.85)',
                    paddingRight: '0.2rem',
                    color: theme.subBackgroundColor,
                  }}
                />
              }
              variant='outlined'
              disabled={true}
            >
              Export
              <div
                style={{
                  padding: '0.18rem',
                  fontSize: '8px',
                  background: 'rgba(64, 224, 208, 0.874)',
                  position: 'absolute',
                  color: 'black',
                  right: '-1rem',
                  fontWeight: 'bold',
                  top: '-0.924rem',
                  borderRadius: '2.5px',
                }}
              >
                COMING SOON
              </div>
            </StyledButton>
          </div> */}
				</div>
				<div
					style={{
						width: '100%',
						borderBottom: `1px solid ${theme.borderColor}`,
						marginBottom: '1.8rem',
					}}></div>
				<Tooltip title='Feel free to request additional filters tailored to your needs.'>
					<span
						style={{
							display: 'block',
							marginLeft: '4.6rem',
							fontSize: '11px',
							color: theme.subText,
							marginBottom: '0.75rem',
							// height: '1.5rem',
							width: '55%',
						}}>
						Apply filters to refine your project search, but be aware that
						projects missing filter data may not appear in the results.{' '}
						<InfoCircleOutlined
							style={{
								color: '#40e0d0',
								position: 'relative',
								bottom: '0.25rem',
							}}
						/>
					</span>
				</Tooltip>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}>
					<div
						style={{
							display: 'flex',
							width: '100%',
							justifyContent: 'center',
							position: 'relative',
							height: '3rem',
						}}>
						<Form
							form={form}
							onFinish={handleSubmit}>
							<div
								style={{
									display: 'flex',
									gap: '0.5rem',
									width: '80%',
									position: 'absolute',
									left: '4.6rem',
								}}>
								<StyledInput
									prefix={
										<SearchOutlined
											style={{
												color: theme.borderColor,
												marginRight: '0.25rem',
											}}
										/>
									}
									placeholder='Company name'
									addonBg={theme.background}
									ref={inputRef}
									id='searchInput'
									textColor={theme.subText}
									value={searchQuery}
									disabled={loading}
									// value={searchQuery}
									onBlur={handleSearchChange}
									onChange={handleSearchChange}
									style={{
										maxWidth: '11rem',
										maxHeight: '2rem',
										background: `${theme.background} !important`,
									}}
									suffix={
										<Tooltip title='Selected Filters will be applied along with company name you search for'>
											<InfoCircleOutlined
												style={{ color: theme.borderColor }}
											/>
										</Tooltip>
									}
								/>
								{/* {Object.entries(filters).map(([filterType, options]) => {
                  // Check if the filterType is "verticals" or "competing_space"
                  if (
                    filterType !== 'verticals' &&
                    filterType !== 'competing_space'
                  ) {
                    return (
                      <Form.Item key={filterType} name={filterType}>
                        <StyledSelect
                          size='middle'
                          addonBg={theme.background}
                          loading={loading}
                          showSearch
                          textColor={theme.subText}
                          key={filterType}
                          placeholder={toReadablePlaceholder(filterType)}
                          style={{ width: 180 }}
                          options={options.map((option) => ({
                            label: option.tag_name,
                            value: option.tag_name,
                          }))}
                        />
                      </Form.Item>
                    );
                  } else {
                    // Render something else for "verticals" and "competing_space" if needed
                    return null; // or any other alternative component
                  }
                })} */}
							</div>
							<div
								style={{
									display: 'flex',
									gap: '0.5rem',
									position: 'absolute',
									right: '3.7rem',
								}}>
								<StyledButton
									variant='outlined'
									onClick={() => clearFilters()}
									disabled={loading}>
									CLEAR
									<CloseCircleOutlined
										style={{
											transform: 'scale(0.85)',
											width: '0.1rem',
											paddingRight: '0.2rem',
											color: '#b85959',
										}}
									/>
								</StyledButton>
								<StyledButton
									variant='outlined'
									onClick={handleSubmit}
									disabled={loading}>
									APPLY
									<RightOutlined
										style={{
											transform: 'scale(0.85)',
											width: '0.1rem',
											paddingRight: '0.2rem',
											color: '#40e0d0',
										}}
									/>
								</StyledButton>
							</div>
						</Form>
					</div>
				</div>
			</div>

			{data.length > 0 && !loading ? (
				<DealFlowContainer
					id='DealFlow'
					width={width}>
					<InfiniteScroll
						dataLength={data.length}
						next={fetchMoreData}
						hasMore={hasMore}
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
							padding: '1.1rem',
							paddingTop: '1rem',
						}}>
						{/* <textarea id='final'></textarea> */}
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
									// project_user_info={project_user_info}
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
						width: '84%',
						borderRadius: '5.4px',
						height: '100%',
						background: theme.body,
						display: 'flex',
						alignItems: 'center',
						padding: '5rem',
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
			) : (
				<DealFlowContainer
					id='DealFlow'
					style={{ padding: '1.5rem' }}>
					Deal flow is not available
				</DealFlowContainer>
			)}
			{/* <ActionsDial /> */}
		</DealFlowWrapper>
	);
};
