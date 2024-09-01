import React from 'react';
import styled, { useTheme } from 'styled-components';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import { useOutletContext } from 'react-router-dom';

interface ContactInterface {
  name: string;
  role: string;
  email: string;
  recommended: boolean;
  company: string;
  linkedIn: string;
  userInfo: any;
}
const ContactCard = ({
  name,
  role,
  email,
  userInfo,
  recommended,
  company,
  linkedIn,
}: ContactInterface) => {
  const subject = `VC Interest in ${company}`;
  const body = `Hi ${name ? name : ''},

I work for the CVC of ${
    userInfo ? userInfo.organization_id : '<COMPANY>'
  }, a large automotive services company, and came across ${company} while researching technology in the industry. I was impressed by your traction and would love to learn more about the company. Would you be available for a call next week to discuss potential investment or commercial opportunities? If someone else at ${company} is better suited to speak with, please let me know.
    
Thank you for your time and I look forward to hearing back from you soon.
  
Best regards,
${userInfo?.name ? userInfo.name : ''}
${userInfo?.email ? userInfo.email : ''}`;
  const props = useOutletContext();
  const theme = useTheme();

  const handleClick = () => {
    const emailUrl = `mailto:${email ? email : ''}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
  };

  return (
    <Wrapper>
      <InnerContainer>
        <Info>
          <Details>
            <h4 style={{ fontWeight: 500, fontSize: '12px', alignSelf: 'flex-start' }}>
              {name ? name : 'Unknown'}{' '}
              {linkedIn && (
                <a href={linkedIn}>
                  <AiIcons.AiFillLinkedin
                    href={linkedIn}
                    style={{ fontSize: '12.5px', cursor: 'pointer', color: '#0077B5' }}
                  />
                </a>
              )}
            </h4>
            <Title>
              {company ? company : 'unknown'} • {role ? role : 'unknown'}
            </Title>
          </Details>
          <Logo src={'https://ui-avatars.com/api/?rounded=true&name=' + name} />{' '}
        </Info>
        <Actions>
          {recommended && <Recommended>RECOMMENDED</Recommended>}
          {/* @ts-ignore */}
          <DeployButton onClick={handleClick} mode={props.isDarkMode}>
            {/* @ts-ignore */}
            <span style={{ color: theme.newIndicator.textColor }}>REACH OUT </span>
            <MdIcons.MdEmail
              style={{
                fontSize: '14px',
                padding: '0rem',
                marginBottom: '0.05rem',
                // @ts-ignore
                color: theme.newIndicator.textColor,
                // @ts-ignore
                fill: theme.newIndicator.textColor,
              }}
            />
          </DeployButton>
        </Actions>
      </InnerContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  /* min-width: 14rem; */
  /* width: 100%; */
  /* height: 5.5rem; */
  border-radius: 5.5px;
  border: 1.5px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.background};
  white-space: nowrap;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.23rem 0.9rem 0.6rem 0.9rem;
  position: relative;
  gap: 0.6rem;
`;
const Logo = styled.img`
  border-radius: 100%;
  height: 2rem;
  width: 2rem;
  background: lightgray;
`;

const Info = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  /* background: pink; */
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 0.1rem;
`;

const Title = styled.span`
  color: #c0c0c0;
  font-size: 9px;
  align-self: flex-start;
`;
const Actions = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  /* align-items: center; */
`;

const DeployButton = styled.button`
  border: none;
  background: ${({ theme }) => theme.newIndicator.color};
  background-color: none;
  border-radius: 5px;
  position: relative;
  width: 100%;
  font-weight: 600;
  display: flex;
  justify-content: center;
  font-size: 10px;
  align-items: center;
  cursor: pointer;
  height: 1.5rem;
  gap: 0.15rem;
  transition: all 0.2s ease;
  color: black;
  &:hover {
    background: #15f6c1;
    transform: scale(1.05);
  }
  &:active {
    background: #ff4c4c;
    transform: scale(0.95);
  }
`;

const Recommended = styled.div`
  border: none;
  /* background: #7eebca; */
  color: #00cf9d;
  position: absolute;
  border-radius: 5px;
  font-weight: 500;
  width: 5rem;
  gap: 1rem;
  font-size: 7.9px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  left: 0.39rem;
  top: 0.3rem;
  text-align: center;
  height: 1.3rem;
  /* color: black; */
`;
export default ContactCard;
