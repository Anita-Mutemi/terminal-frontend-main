
import { useEffect, useState, useContext } from 'react';
import styled, { useTheme } from 'styled-components';
import axios from 'axios';
import ReportCard from '../UI/ReportCard';
import { useSelector } from 'react-redux';
import DashboardContext from '../hooks/DashboardContext';

const Reports = () => {
  // @ts-ignore
  // const reportsProps = useContext(DashboardContext);
  // const theme = useTheme();

  const [reports, setReports] = useState<any>([]);
  const { access_token } = useSelector(
    (state: any) => state.user,
  );
  const generateReport = async () => {
    const config = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    };
    const { data } = await axios.get(`/v1/reports/reports/weekly`, config);
    setReports(data);
    return data;
  };

  useEffect(() => {
    generateReport();
  }, []);
  return (
    <ReportsWrapper>
      <ReportsList>
        {reports.map(
          (
            report: {
              uuid: string;
              start_date: string;
              report_type: string;
              report_stats: {
                feedback_projects_percentage: number;
                most_active_user: string;
              };
            },
            index: number,
          ) => {
            // teamfeedbackprojectpercentage
            return (
              <ReportCard
                id={report.uuid}
                time={report.start_date}
                // @ts-ignore
                performance={report.report_stats.team_feedback_projects_percentage}
                user={report.report_stats.most_active_user}
                index={index + 1}
                key={report.uuid}
              />
            );
          },
        )}
      </ReportsList>
    </ReportsWrapper>
  );
};

const ReportsWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  /* height: 100%; */
  /* min-height: 100%; */
  background: ${({ theme }) => theme.body};
  justify-content: center;
`;

const ReportsList = styled.div`
  width: 100%;
  padding: 1rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.body};
`;

export default Reports;
