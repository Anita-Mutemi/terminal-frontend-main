// CreatePromptModal.js

import { Switch, Popconfirm } from 'antd';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip, Empty } from 'antd';
import { useOutletContext } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { useTheme } from 'styled-components';

import AiImage from './ai.png';
import logo from './logo.png';
import logoBlack from './logo-black.png';
import modelsBlack from './models-black.png';
import models from './models.png';
import moment from 'moment';

const CoPilotCard = ({
	id,
	isDarkMode,
	coPilotName,
	deploymentDate,
	companiesSinceDeployment,
	coPilotAuthor,
	createMode = false,
	thesis,
	onCreate,
	onUpdate,
	access_token,
	onDelete,
	list,
	isVisible,
	onClose,
}) => {
	const props = useOutletContext();

	const [name, setName] = useState(coPilotName || 'Agent Name...');
	const [active, setActive] = useState(list?.active || false);
	const [promptText, setPromptText] = useState(thesis);

	const copilotNameRef = React.createRef();

	const [data, setData] = useState([]);
	// State for loading indication
	const [isLoading, setIsLoading] = useState(false);
	// State for storing any errors
	const [error, setError] = useState(null);

	// Access token should be securely handled, here's a placeholder
	const theme = useTheme();
	const appMode = isDarkMode !== 'light';

	const fetchData = async () => {
		const config = {
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		};

		try {
			setIsLoading(true);
			const response = await axios.get(`/v1/user/funds`, config);
			const fundsData = response.data;

			setData(fundsData);
		} catch (err) {
			setError(err);
			console.error('Error fetching data:', err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (createMode && copilotNameRef.current) {
			copilotNameRef.current.focus();
		}
	}, [createMode]);

	const nameHandler = (e) => {
		const {
			target: { value },
		} = e;
		return setName((prev) => value);
	};

	const activeHandler = (value) => {
		return setActive((prev) => !prev);
	};

	const handleSave = () => {
		onUpdate(list.id, {
			name: name,
			prompt: promptText,
			active: active,
		});
		onClose();
	};

	const promptTextHandler = (e) => {
		const {
			target: { value },
		} = e;
		setPromptText(value);
	};

	const handleCreate = () => {
		if (name === 'Agent Name...') {
			alert('Enter Agent Name');
			return;
		}
		if (promptText.length < 5) {
			alert('Enter Your Thesis');
			return;
		}
		if (name.length > 0 && promptText.length > 0) {
			onCreate({ name: name, prompt: promptText, active: false });
			onClose();
		} else {
			// Show error or indication that fields are required
		}
	};

	if (isVisible) {
		return (
			<div
				style={{
					width: '90%',
					position: 'absolute',
					height: '60%',
					overflow: 'hidden',
					zIndex: 9999,
					color: theme.text,
				}}
				onClick={onClose}>
				<CoPilotCardWrapper
					mode={props.isDarkMode}
					onClick={(e) => e.stopPropagation()}>
					<BackgroundImage mode={props.isDarkMode} />
					<CoPilotCardContent>
						<CoPilotInfo>
							<div
								style={{
									position: 'absolute',
									color: theme.text,
									width: '2rem',
									height: '2rem',
									right: '0rem',
									top: '0rem',
									fontSize: '2rem',
									cursor: 'pointer',
								}}
								onClick={onClose}>
								✕
							</div>
							<img
								src={AiImage}
								alt='AI Model'
								style={{
									position: 'absolute',
									width: '2.3rem',
									height: '2.3rem',
									left: '-1.5rem',
									top: '0rem',
								}}
							/>

							<CoPilotHeader>
								<CoPilotName
									ref={copilotNameRef}
									value={name ?? 'Agent Name...'}
									onChange={nameHandler}></CoPilotName>
								{!createMode && (
									<Switch
										checked={active}
										onChange={(checked) => {
											setActive(!active);
											onUpdate(list.id, { ...list, active: !active });
										}}
										style={{
											marginLeft: '0.5rem',
											background: active ? 'rgb(28, 198, 164)' : 'gray',
											position: 'absolute',
											right: '4rem',
											top: '1.1rem',
											transform: 'scale(1.3)',
										}}
									/>
								)}
							</CoPilotHeader>
							<CoPilotDescription>
								<DescriptionColumn>
									<DescriptionText>
										<p>
											Your TwoTensor Agent operates as a fully autonomous agent,
											analyzing each source to identify companies aligning with
											your thesis. Return later to refine your thesis.
										</p>
										<ul>
											<li>
												<p>
													You will receive a daily email summarizing the
													companies captured in the preceding 24 hours.
												</p>
											</li>
										</ul>
									</DescriptionText>
								</DescriptionColumn>
								<ActiveThesis>
									<ActiveThesisLabel>Agent prompt:</ActiveThesisLabel>
									<ActiveThesisPlaceholder
										resize='none'
										placeholder={'Enter your thesis here...'}
										mode={props.isDarkMode}
										onChange={promptTextHandler}>
										{promptText}
									</ActiveThesisPlaceholder>
								</ActiveThesis>
								<ActiveThesisExample>
									<strong
										style={{
											fontWeight: 'bold',
											display: 'block',
											marginBottom: '0.71rem',
										}}>
										Example:{' '}
									</strong>
									Identify early-stage crypto projects that leverage AI for
									targeting B2B buyers, excluding those at Series A and above,
									based in Western Europe but excluding the UK.
									<br />
									<ul>
										<li>Be specific with what you want to exclude.</li>
									</ul>
								</ActiveThesisExample>
							</CoPilotDescription>
						</CoPilotInfo>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								// border: '1px solid yellow',
							}}>
							<AIModelInfo>
								<AIModelLabel>AI Model:</AIModelLabel>
								<AIModelImage
									src={props.isDarkMode === 'dark' ? models : modelsBlack}
									alt='AI Model'
								/>
							</AIModelInfo>
							<DeploymentInfo>
								<DeploymentDateLabel>
									Portfolio Deal Sources:
								</DeploymentDateLabel>
								<DeploymentDateValue>
									{isLoading && (
										<div style={{ height: '35px' }}>
											Loading Deal Sources... <LoadingOutlined />
										</div>
									)}
									{!isLoading && (
										<div>
											{data && data.length > 0 ? (
												<Avatar.Group maxCount={6}>
													{data.map((fund, index) => (
														<Tooltip
															key={index}
															title={fund.name || 'Fund'}
															placement='top'>
															<Avatar
																alt={`Logo of ${fund.name}`}
																src={fund.logo}
															/>
														</Tooltip>
													))}
												</Avatar.Group>
											) : (
												<div>-</div>
											)}
										</div>
									)}
								</DeploymentDateValue>
							</DeploymentInfo>
							<DeploymentInfo>
								<DeploymentDateLabel>Deployment Date:</DeploymentDateLabel>
								<DeploymentDateValue>
									{moment(deploymentDate).format('MMMM Do YYYY') ??
										'Pending Deployment'}
								</DeploymentDateValue>
							</DeploymentInfo>
							<AuthorInfo>
								<AuthorLabel>Agent Author:</AuthorLabel>
								<AuthorName>{coPilotAuthor}</AuthorName>
							</AuthorInfo>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-around',
								// border: '1px solid red',
							}}>
							<FineTuningInfo>
								<FineTuningLabel>Fine Tuning:</FineTuningLabel>
								<img
									src={props.isDarkMode === 'dark' ? logo : logoBlack}
									alt='Signal Count'
									style={{
										width: '10rem',
										height: '2.65rem',
									}}
								/>
							</FineTuningInfo>
							<CompaniesSinceDeployment>
								<CompaniesSinceDeploymentLabel>
									Companies Since Deployment:
								</CompaniesSinceDeploymentLabel>
								<CompaniesSinceDeploymentValue>
									{companiesSinceDeployment ?? 'Pending Deployment'}
								</CompaniesSinceDeploymentValue>
							</CompaniesSinceDeployment>
							<div style={{ height: '75px' }}>
								{/* <RawSignalCount>Raw Signal Count:</RawSignalCount>
								<SignalCountValue>
									13456<span>/month</span>
								</SignalCountValue> */}
							</div>

							{createMode && (
								<DeployCoPilotButton onClick={handleCreate}>
									<span>Deploy Agent →</span>
								</DeployCoPilotButton>
							)}
							{!createMode && (
								<div
									style={{
										display: 'flex',
										gap: '0.6rem',
										justifyContent: 'space-between',
									}}>
									<Popconfirm
										key='delete'
										title='Are you sure to delete this agent?'
										onConfirm={() => onDelete(id)}
										okText='Yes'
										cancelText='No'>
										<DeleteCoPilotButton>
											<span>Delete</span>
										</DeleteCoPilotButton>
										{/* <Button danger>Delete</Button> */}
									</Popconfirm>
									{/* <DeleteCoPilotButton>
										<span style={{ fontWeight: 'bold' }}>DELETE</span>
									</DeleteCoPilotButton> */}
									<DeployCoPilotButton onClick={handleSave}>
										<span>Save</span>
									</DeployCoPilotButton>
								</div>
							)}
						</div>
					</CoPilotCardContent>
				</CoPilotCardWrapper>
			</div>
		);
	}
};

const CoPilotCardWrapper = styled.div`
	display: flex;
	position: fixed; /* Use fixed to keep it in place even on scroll */
	top: 50%;
	left: 50%;
	width: 75rem;
	height: 41rem;
	z-index: 99699;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: translate(-50%, -50%);
	flex-direction: column;
	overflow: hidden;
	border: ${({ mode }) =>
		mode === 'dark' ? `4px solid #0b0b0b` : `4px solid #ededed`};
	background: ${({ mode }) => (mode === 'dark' ? `#0b0b0b` : `#e5e5e5`)};

	padding: 25px;
	/* background: rgb(8, 8, 8); */

	border-radius: 15px;

	@media (max-width: 991px) {
		padding: 0 20px;
	}
`;

const BackgroundImage = styled.div`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
	background: rgb(8, 8, 8);
	background: ${({ mode }) =>
		mode === 'dark' ? `rgb(27, 27, 30)` : `rgb(252, 252, 252)`};
`;

const CoPilotCardContent = styled.div`
	position: relative;
	display: flex;
	width: 97%;
	height: 100%;
	/* max-width: 1685px; */
	padding: 0.2rem;
	gap: 2rem;

	/* gap: 20px; */
	justify-content: space-around;

	@media (max-width: 991px) {
		max-width: 100%;
		flex-wrap: wrap;
	}
`;
const CoPilotCardContentFirst = styled.div`
	position: relative;
	display: flex;
	width: 40%;
	/* background: green; */
	/* max-width: 1685px; */
	/* margin-top: 24px; */
	gap: 20px;
	justify-content: space-between;

	@media (max-width: 991px) {
		max-width: 100%;
		flex-wrap: wrap;
	}
`;
const CoPilotCardContentSecond = styled.div`
	position: relative;
	display: flex;
	width: 40%;
	/* background: yellow; */
	/* max-width: 1685px; */
	/* margin-top: 24px; */
	gap: 20px;
	justify-content: space-between;

	@media (max-width: 991px) {
		max-width: 100%;
		flex-wrap: wrap;
	}
`;
const CoPilotCardContentThird = styled.div`
	position: relative;
	display: flex;
	width: 40%;
	/* background: purple; */
	/* max-width: 1685px; */
	/* margin-top: 24px; */
	gap: 20px;
	justify-content: space-between;

	@media (max-width: 991px) {
		max-width: 100%;
		flex-wrap: wrap;
	}
`;

const CoPilotInfo = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	overflow: hidden;
	/* background: purple; */
	/* border: 1px solid blue; */
	max-width: 44rem;
	@media (max-width: 991px) {
		max-width: 100%;
	}
`;

const CoPilotHeader = styled.header`
	display: flex;
	align-items: start;
	gap: 20px;
	margin-top: 2rem;
	align-self: top;
	position: relative;
	color: ${({ theme }) => theme.text};

	@media (max-width: 991px) {
		max-width: 100%;
		flex-wrap: wrap;
		padding-right: 20px;
	}
`;

const CoPilotName = styled.input`
	flex-grow: 1;
	background: none;
	border: none;
	flex-basis: auto;
	font: 400 44px Plantagenet Cherokee, 'Plantagenet Cherokee', -apple-system,
		Roboto, Helvetica, sans-serif !important;
	color: ${({ theme }) => theme.text} !important;

	&:focus {
		outline: none; /* Remove the default outline on focus */
		border-bottom: 1px solid ${({ theme }) => theme.text}; /* Add a bottom border on focus */
	}
`;

const AIModelInfo = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 15px;
	font-weight: 700;
`;

const AIModelLabel = styled.span`
	font-family: Inter, sans-serif;
	font-weight: bold;
	color: ${({ theme }) => theme.text};
`;

const AIModelImage = styled.img`
	width: 200px;
	aspect-ratio: 5.88;
	object-fit: contain;
	margin-top: 6px;
`;

const CoPilotDescription = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	flex: 2;
	margin-top: 23px;

	@media (max-width: 991px) {
		flex-direction: column;
		align-items: stretch;
		gap: 0;
		max-width: 100%;
	}
`;

const DescriptionColumn = styled.div`
	display: flex;
	flex-direction: column;
	line-height: normal;
	width: 73%;
	margin-left: 0;

	@media (max-width: 991px) {
		width: 100%;
	}
`;

const DescriptionText = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	font-weight: 400;

	@media (max-width: 991px) {
		max-width: 100%;
		margin-top: 40px;
	}

	p {
		font-family: Inter, sans-serif;
		margin-top: 21px;

		@media (max-width: 991px) {
			max-width: 100%;
		}
	}
`;

const ImageColumn = styled.div`
	display: flex;
	flex-direction: column;
	line-height: normal;
	width: 27%;
	margin-left: 20px;

	@media (max-width: 991px) {
		width: 100%;
	}

	img {
		width: 323px;
		max-width: 100%;
		aspect-ratio: 3.7;
		object-fit: contain;
		margin-top: 47px;
		flex-grow: 1;

		@media (max-width: 991px) {
			margin-top: 40px;
		}
	}
`;

const FineTuningInfo = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 15px;
	color: ${({ theme }) => theme.text};
	justify-content: space-between;
	font-weight: 700;
`;

const FineTuningLabel = styled.span`
	font-family: Inter, sans-serif;
	font-weight: bold;
`;

const RawSignalCount = styled.div`
	font-family: Inter, sans-serif;
	font-weight: bold;

	@media (max-width: 991px) {
	}
`;

const SignalCountValue = styled.div`
	font: 30px Inter, sans-serif;

	span {
		font-weight: 400;
		font-size: 15px;
	}
`;

const ActiveThesis = styled.section`
	position: relative;
	z-index: 10;
	display: flex;
	flex-direction: column;
	width: 734px;
	max-width: 100%;
	font-size: 15px;
	color: ${({ theme }) => theme.text};

	@media (max-width: 991px) {
		margin-top: 40px;
	}
`;

const ActiveThesisLabel = styled.h3`
	font-family: Inter, sans-serif;
	font-weight: 700;
	font-size: 15px;

	@media (max-width: 991px) {
		max-width: 100%;
	}
`;

const ActiveThesisPlaceholder = styled.textarea`
	height: 61px;
	padding: 0.5rem;
	resize: none;
	margin-top: 15px;
	min-width: 20rem;
	width: auto;
	max-width: 90%;
	border-radius: 10px;
	background: ${({ mode }) => (mode === 'dark' ? `#d9d9d9` : `#ffffff`)};

	@media (max-width: 991px) {
		max-width: 100%;
	}
`;

const ActiveThesisExample = styled.div`
	font-family: Inter, sans-serif;
	font-weight: 400;
	color: color: ${({ theme }) => theme.text};
	font-size: 15px;
	width: 80ch;
	margin-top: 0.35rem;

	@media (max-width: 991px) {
		max-width: 100%;
		margin-top: 40px;
	}
`;

const DeploymentInfo = styled.div`
	position: relative;
	display: flex;
	gap: 0.5rem;
	flex-direction: column;
	font-size: 15px;
	color: ${({ theme }) => theme.text};

	@media (max-width: 991px) {
	}
`;

const DeploymentDateLabel = styled.span`
	font-family: Inter, sans-serif;
	font-weight: 700;
`;

const DeploymentDateValue = styled.span`
	font-family: Inter, sans-serif;
	font-weight: 400;
`;

const CompaniesSinceDeployment = styled.div`
	position: relative;
	z-index: 10;
	display: flex;
	gap: 0.2rem;
	flex-direction: column;
	font-size: 15px;
	color: ${({ theme }) => theme.text};

	@media (max-width: 991px) {
		margin-right: 10px;
	}
`;

const CompaniesSinceDeploymentLabel = styled.span`
	font-family: Inter, sans-serif;
	font-weight: 700;
`;

const CompaniesSinceDeploymentValue = styled.span`
	font-family: Inter, sans-serif;
	margin-top: 0.3rem;
	font-weight: 400;
`;

const AuthorInfo = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	color: ${({ theme }) => theme.text};

	@media (max-width: 991px) {
	}
`;

const AuthorLabel = styled.span`
	font: 700 15px Inter, sans-serif;
`;

const AuthorName = styled.h2`
	margin-top: 0.35rem;
	font: 300 30px Plantagenet Cherokee, -apple-system, Roboto, Helvetica,
		sans-serif !important;
`;

const DeployCoPilotButton = styled.button`
	position: relative;
	align-self: end;
	z-index: 10;
	cursor: pointer;
	display: flex;
	gap: 10px;
	font-weight: 300;
	font-size: 15px;
	border: none;
	color: #ffffff;
	padding: 7px 17px;
	border-radius: 4px;
	background-color: rgb(28, 198, 164);

	@media (max-width: 991px) {
		margin-right: 10px;
		padding: 0 20px;
	}

	span {
		font-family: Inter, sans-serif;
		flex-grow: 1;
	}

	img {
		width: 25px;
		aspect-ratio: 1.14;
		object-fit: contain;
		stroke-width: 3px;
		stroke: #000;
		border: 3px solid rgba(0, 0, 0, 1);
	}
`;
const DeleteCoPilotButton = styled.button`
	position: relative;
	align-self: end;
	z-index: 10;
	display: flex;
	gap: 10px;
	font-size: 15px;
	color: #ffffff;
	border: none;
	font-weight: 200;
	padding: 7px 17px;
	border-radius: 4px;
	background-color: #ef6666;

	@media (max-width: 991px) {
		margin-right: 10px;
		padding: 0 20px;
	}

	span {
		font-family: Inter, sans-serif;
		flex-grow: 1;
	}

	img {
		width: 25px;
		aspect-ratio: 1.14;
		object-fit: contain;
		stroke-width: 3px;
		stroke: #000;
		border: 3px solid rgba(0, 0, 0, 1);
	}
`;

export default CoPilotCard;
