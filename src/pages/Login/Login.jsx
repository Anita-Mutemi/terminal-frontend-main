import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, getUserDetails } from '../../features/user/userActions';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import * as AiIcons from 'react-icons/ai';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
// import Logo from '@mui/material/Logo';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import twoTensorLogo from '../../assets/logo-gray.png';

// import { ReactComponent as Logo } from '../../assets/logo.svg'; // Your logo file
import TextFieldIcon from '../../UI/TextFieldIcon';
import styled from 'styled-components';
import logo from './image4.png';

// Styled Components
const Container = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	background-image: url(https://resources.netbase.com/cb/images/Noise_Filter_Layer.png),
		url(https://resources.netbase.com/cb/images/QUID_Gradients_T2_XXS.jpeg);
	background-size: cover;
	background-position: center;
	background-blend-mode: soft-light;
	background-size: 320px 320px, 100% 100%;
	background-repeat: repeat, no-repeat;
	background: linear-gradient(to top right, #001717, #045148);
`;

const LoginBox = styled.div`
	width: 100%;
	max-width: 294px;
	padding: 1.2rem;
	background: #fff;
	box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	text-align: center;
`;

const StyledLogo = styled.img`
	margin-bottom: 2rem;
	width: 3rem;
`;

const StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const StyledTextField = styled(TextField)`
	margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
	margin-top: 1.6rem;
	margin-bottom: 0rem;
	height: 100%;
	padding: 0.98rem;
	font-size: 16.5px;
	background-color: #022924;
`;

const ErrorAlert = styled(Alert)`
	margin-bottom: 1rem;
`;

const CopyRightContainer = styled.div`
	text-align: center;
	margin-top: 2rem;
	color: white;
	font-size: 12px;
`;

// Modified to add Schedule Intro Link
const ScheduleLinkContainer = styled.div`
	margin-top: 1rem; // Adjust as needed for design consistency
`;

// Component
export default function SignInSide() {
	const { loading, error, userInfo, access_token } = useSelector(
		(state) => state.user,
	);
	const dispatch = useDispatch();
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();

	useEffect(() => {
		if (access_token) {
			dispatch(getUserDetails());
			if (userInfo?.organization_id === 'DEMO') {
				navigate('/connected-ventures');
				return;
			}
			navigate('/');
		}
	}, [access_token, dispatch, navigate, userInfo?.organization_id]);

	const submitForm = (data) => {
		dispatch(userLogin(data));
		navigate('/');
	};

	return (
		<Container>
			<LoginBox>
				<img
					src={logo}
					alt='logo'
					style={{ width: '85%', marginBottom: '1rem', marginLeft: '0.7rem' }}
				/>
				{error && <ErrorAlert severity='error'>{error}</ErrorAlert>}
				<StyledForm
					noValidate
					onSubmit={handleSubmit(submitForm)}>
					<TextFieldIcon
						{...register('username')}
						variant='outlined'
						margin='normal'
						required
						fullWidth
						placeholder='yours@example.com'
						id='email'
						label='Username'
						name='username'
						styles={{ width: '93%', alignSelf: 'center' }}
						icon={AiIcons.AiOutlineUser}
						autoFocus
					/>
					<TextFieldIcon
						{...register('password')}
						variant='outlined'
						margin='normal'
						required
						fullWidth
						name='password'
						placeholder='your password'
						label='Password'
						type='password'
						styles={{ width: '93%', alignSelf: 'center' }}
						id='password'
						icon={AiIcons.AiOutlineLock}
						autoComplete='current-password'
					/>
					<StyledButton
						type='submit'
						fullWidth
						variant='contained'
						color='primary'>
						LOG IN
					</StyledButton>
				</StyledForm>
			</LoginBox>
			<CopyRightContainer>
				{'Copyright © '}
				<Link color='inherit'>TwoTensor | Terminal </Link>
				{new Date().getFullYear()}
				{'.'}
			</CopyRightContainer>
			<ScheduleLinkContainer>
				<Link
					style={{ color: 'orange', textDecoration: 'underline' }}
					href='https://calendly.com/danielafshar/meeting'
					target={'_blank'}>
					Schedule Intro
				</Link>
			</ScheduleLinkContainer>
		</Container>
	);
}
