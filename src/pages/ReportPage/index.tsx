// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';
import Project from '../../components/Project';
import { useParams } from 'react-router-dom';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import styled, { useTheme } from 'styled-components';
import { styled as muiStyled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// import { muiStyled } from '@mui/system';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { loadPartialConfig } from '@babel/core';
import { VscLoading } from 'react-icons/vsc';

const Chart = ({ percentage }: { percentage: number }) => {
  const colors = [
    percentage >= 80 ? '#3dc76f' : percentage >= 50 ? '#f5cd19' : '#ff5050',
    '#f0f0f0',
  ];
  const data = [
    { name: 'Percentage', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];
  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        dataKey='value'
        nameKey='name'
        cx='45%'
        cy='45%'
        innerRadius={45}
        outerRadius={70}
        fill='#8884d8'
        animationBegin={2000}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
        <Label value={percentage + '%'} position='center' fontSize={20} />
      </Pie>
    </PieChart>
  );
};

const StyledTableCell = muiStyled(TableCell)(({ theme }) => {
  const customTheme = useTheme();

  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: customTheme.subBackground,
      color: customTheme.text,
    },
    [`&.${tableCellClasses.body}`]: {
      backgroundColor: customTheme.body,
      color: customTheme.text,
      fontSize: 14,
    },
  };
});

const StyledTableRow = muiStyled(TableRow)(({ theme }) => {
  const customTheme = useTheme();

  return {
    '&:nth-of-type(odd)': {
      backgroundColor: customTheme.background,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  };
});
const ReportPage = () => {
  const params = useParams();
  const theme = useTheme();
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const { error, userInfo, access_token } = useSelector((state: any) => state.user);

  const config = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
  };
  const getReportData = async () => {
    try {
      const { data } = await axios.get(`/v1/reports/reports/${params.id}`, config);
      setReportData(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getColor = (number) => {
    if (number <= 49) return 'red';
    if (number <= 80) return 'rgb(234, 176, 77)';
    if (number <= 100) return 'green';
  };

  useEffect(() => {
    getReportData();
  }, []);
  return (
    <ReportWrapper>
      {!loading ? (
        <Wrapper>
          <div
            style={{
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <TableWrapper>
              <CardHeader>
                {/* @ts-ignore */}
                <CardIcon background='#74386d'>
                  <RiIcons.RiTeamFill
                    style={{ color: '#ec72cf', transform: 'scale(1.55)' }}
                  ></RiIcons.RiTeamFill>
                </CardIcon>
                <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
                  Team members statistics:
                </SubTitle>
              </CardHeader>
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table
                    sx={{ minWidth: 650, boxShadow: 'none' }}
                    aria-label='simple table'
                  >
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell align='center'>Name</StyledTableCell>
                        <StyledTableCell align='center'>Overall</StyledTableCell>
                        <StyledTableCell align='center'>Great Projects</StyledTableCell>
                        <StyledTableCell align='center'>Good Projects</StyledTableCell>
                        <StyledTableCell align='center'>Unfit Projects</StyledTableCell>
                        <StyledTableCell align='center'>
                          Feedback Provided
                        </StyledTableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.users_stats.map((user) => (
                        <StyledTableRow
                          key={user.username}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <StyledTableCell align='center'>
                            {user.username}
                          </StyledTableCell>
                          <StyledTableCell
                            component='th'
                            scope='row'
                            style={{
                              color: `${getColor(user.feedback_projects_percentage)}`,
                            }}
                          >
                            <span>{user.feedback_projects_percentage}%</span>
                          </StyledTableCell>
                          <StyledTableCell align='center'>
                            {user.great_projects.length}
                          </StyledTableCell>
                          <StyledTableCell align='center'>
                            {user.good_projects.length}
                          </StyledTableCell>
                          <StyledTableCell align='center'>
                            {user.unfit_projects.length}
                          </StyledTableCell>
                          <StyledTableCell align='center'>
                            {user.projects_with_feedback.length}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </TableWrapper>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <OverallTeamPercentageWrapper>
                <CardHeaderChart>
                  {/* @ts-ignore */}
                  <CardIcon background='#384374'>
                    <BiIcons.BiStats
                      style={{ color: '#72a6ec', transform: 'scale(1.55)' }}
                    ></BiIcons.BiStats>
                  </CardIcon>
                  <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
                    Overall performance
                  </SubTitle>
                </CardHeaderChart>
                <ChartWrapper>
                  <Chart percentage={reportData.team_feedback_projects_percentage} />
                </ChartWrapper>
              </OverallTeamPercentageWrapper>
              <BestUserWrapper>
                <CardHeader>
                  {/* @ts-ignore */}
                  <CardIcon background='#745b38'>
                    <FaIcons.FaCrown
                      style={{ color: '#fbc44d', transform: 'scale(1.55)' }}
                    ></FaIcons.FaCrown>
                  </CardIcon>
                  <SubTitle style={{ paddingLeft: '1rem', paddingTop: '0.5rem' }}>
                    The most active user
                  </SubTitle>
                </CardHeader>
                <ProfilePictureWrapper>
                  <UserWrapper>
                    <img
                      src={
                        'https://ui-avatars.com/api/?rounded=true&name=' +
                        reportData.most_active_user
                      }
                      alt='user-logo'
                      style={{ width: '2rem' }}
                    />
                    {reportData.most_active_user}
                  </UserWrapper>
                </ProfilePictureWrapper>
              </BestUserWrapper>
            </div>
          </div>
          <br />
          <h1>THE GREAT PROJECTS OF THE WEEK:</h1>
          <br />
          {reportData.great_projects.length > 0 ? (
            <ProjectWrapper>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportData.great_projects.map((project: any) => {
                  return <Project {...project} info={{ project: project }} />;
                })}
              </div>
            </ProjectWrapper>
          ) : (
            <h4>Projects are not found</h4>
          )}
          <br />
          <h1>UNRATED PROJECTS OF THE WEEK:</h1>
          {reportData.unrated_projects.length > 0 ? (
            <ProjectWrapper>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportData.unrated_projects.map((project: any) => {
                  return <Project {...project} info={{ project: project }} />;
                })}
              </div>
            </ProjectWrapper>
          ) : (
            <h4>Unrated projects are not found</h4>
          )}
          <h1>PROJECTS THAT ONLY HAD ONE POSITIVE RESPONSE:</h1>
          {reportData.one_response_projects.length > 0 ? (
            <ProjectWrapper>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportData.one_response_projects.map((project: any) => {
                  return <Project {...project} info={{ project: project }} />;
                })}
              </div>
            </ProjectWrapper>
          ) : (
            <h4>Projects are not found</h4>
          )}
          <h1>PROJECTS WHICH WERE RATED AS “UNFIT” WITHOUT FEEDBACK:</h1>
          {reportData.unfit_no_feedback.length > 0 ? (
            <ProjectWrapper>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reportData.unfit_no_feedback.map((project: any) => {
                  return <Project {...project} info={{ project: project }} />;
                })}
              </div>
            </ProjectWrapper>
          ) : (
            <h4>Projects are not found</h4>
          )}
        </Wrapper>
      ) : (
        <Oval
          height={60}
          width={60}
          color={theme.text}
          wrapperStyle={{}}
          wrapperClass=''
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor={theme.subTitle}
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      )}
      <br></br>
      <br></br>
    </ReportWrapper>
  );
};

const ReportWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  background: ${({ theme }) => theme.body};
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProjectWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.body};
  border: 0px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  flex-grow: 1,
  display:flex;
  justify-content: center;
  flex-direction:column:
  gap:1rem;
  padding:0.5rem;
`;

const TableWrapper = styled.div`
  width: 100%;
  /* min-height: 18rem; */
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  /* margin-left: 1.5rem; */
  overflow: hidden;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  overflow-x: hidden;
`;

const ProfilePictureWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  /* height: 25%; */
  padding-top: 1rem;
`;

const UserWrapper = styled.div`
  border: 0px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  padding: 0.4rem;
  gap: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverallTeamPercentageWrapper = styled.div`
  width: 24.5rem;
  height: 14rem;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  margin-left: 1.5rem;
  /* margin-right: 1.5rem; */
  overflow: hidden;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  overflow-x: hidden;
`;
const BestUserWrapper = styled.div`
  width: 24.5rem;
  height: 7.5rem;
  background: ${({ theme }) => theme.background};
  border-radius: 5px;
  margin-left: 1.5rem;
  overflow: hidden;
  z-index: 999;
  border: 0px solid ${({ theme }) => theme.borderColor};
  overflow-x: hidden;
`;

const ChartWrapper = styled.div`
  /* height: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const CardIcon = styled.div`
  background: ${({ background }) => background};
  border-right: 0px solid ${({ theme }) => theme.borderColor};
  width: 2.5rem;
  padding: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  position: relative;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 400;
`;
const CardHeader = styled.div`
  min-height: 2.35rem;
  display: flex;
  border-bottom: 0px solid ${({ theme }) => theme.borderColor};
`;
const CardHeaderChart = styled.div`
  min-height: 2.35rem;
  margin-bottom: 0.1rem;
  display: flex;
  border-bottom: 0px solid ${({ theme }) => theme.borderColor};
`;
export default ReportPage;
