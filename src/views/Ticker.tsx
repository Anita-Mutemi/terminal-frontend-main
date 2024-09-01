import React from 'react';
import styled from 'styled-components';

const Ticker = () => {
  const headLine = [
    {
      number: 1,
      headline: 'Former Apple executive joins startup to lead product development',
      date: '03/14/2023',
      time: '10:00AM',
    },
    {
      number: 2,
      headline: 'Ex-Fed official becomes CEO of fintech startup',
      date: '02/22/2023',
      time: '03:30PM',
    },
    {
      number: 3,
      headline: 'Former Tesla engineer launches electric vehicle startup',
      date: '03/10/2023',
      time: '09:15AM',
    },
  ];

  const news = [
    {
      'No.': 1,
      'Date': '2023-03-13',
      'Time': '10:00AM',
      'Headline':
        'Former Apple and Facebook executives join forces to launch social media platform for Gen Z',
    },
    {
      'No.': 2,
      'Date': '2023-03-09',
      'Time': '03:30PM',
      'Headline': 'Former Amazon executive becomes CEO of robotics startup',
    },
    {
      'No.': 3,
      'Date': '2023-03-07',
      'Time': '09:15AM',
      'Headline': 'Former Google executive joins autonomous driving startup as COO',
    },
    {
      'No.': 4,
      'Date': '2023-03-02',
      'Time': '12:45PM',
      'Headline':
        'Former Microsoft executive starts cybersecurity startup, raises $50M in seed funding',
    },
    {
      'No.': 5,
      'Date': '2023-02-28',
      'Time': '04:00PM',
      'Headline':
        'Former Tesla VP joins blockchain startup to develop energy trading platform',
    },
    {
      'No.': 6,
      'Date': '2023-02-24',
      'Time': '11:20AM',
      'Headline':
        'Former Netflix executive co-founds AI startup to disrupt film industry',
    },
    {
      'No.': 7,
      'Date': '2023-02-20',
      'Time': '02:10PM',
      'Headline':
        'Former Facebook CMO joins healthtech startup to lead marketing strategy',
    },
    {
      'No.': 8,
      'Date': '2023-02-15',
      'Time': '09:30AM',
      'Headline': 'Former Airbnb executive becomes CEO of home automation startup',
    },
    {
      'No.': 9,
      'Date': '2023-02-11',
      'Time': '01:15PM',
      'Headline':
        'Former Intel executive starts quantum computing startup, raises $100M in funding',
    },
    {
      'No.': 10,
      'Date': '2023-02-05',
      'Time': '05:00PM',
      'Headline':
        'Former PayPal COO joins fintech startup to develop new payment platform',
    },
    {
      'No.': 11,
      'Date': '2023-02-02',
      'Time': '10:30AM',
      'Headline': 'Former IBM executive becomes CTO of cloud computing startup',
    },
    {
      'No.': 12,
      'Date': '2023-01-28',
      'Time': '03:40PM',
      'Headline':
        'Former Amazon and Microsoft executives co-found cloud security startup, raise $75M in funding',
    },
    {
      'No.': 13,
      'Date': '2023-01-24',
      'Time': '11:00AM',
      'Headline':
        'Former Google and Uber executives join forces to launch self-driving truck startup',
    },
    {
      'No.': 14,
      'Date': '2023-01-18',
      'Time': '02:20PM',
      'Headline': 'Former Facebook and Twitter executives start social commerce platform',
    },
    {
      'No.': 15,
      'Date': '2023-01-12',
      'Time': '09:45AM',
      'Headline': 'Former Microsoft executive becomes CEO of cybersecurity startup',
    },
    {
      'No.': 16,
      'Date': '2023-01-07',
      'Time': '01:30PM',
      'Headline': 'Former Apple executive co-founds electric aircraft startup',
    },
    {
      'No.': 17,
      'Date': '2023-01-02',
      'Time': '04:15PM',
      'Headline':
        'Former Google and Amazon executives start AI-powered personal shopping startup',
    },
    {
      'No.': 18,
      'Date': '2022-12-28',
      'Time': '10:50AM',
      'Headline': 'Former Intel executive joins quantum computing startup as COO',
    },
    {
      'No.': 19,
      'Date': '2022-12-22',
      'Time': '03:25PM',
      'Headline':
        'Former Facebook and Snap executives start social media analytics startup',
    },
    {
      'No.': 20,
      'Date': '2022-12-18',
      'Time': '11:15AM',
      'Headline':
        'Former Microsoft and Amazon executives join forces to launch cloud storage startup',
    },
    {
      'No.': 21,
      'Date': '2022-12-12',
      'Time': '02:30PM',
      'Headline':
        'Former Apple executive joins virtual reality startup to develop new gaming platform',
    },
    {
      'No.': 22,
      'Date': '2022-12-06',
      'Time': '10:00AM',
      'Headline': 'Former Google and Facebook executives co-found mobile health startup',
    },
    {
      'No.': 23,
      'Date': '2022-11-30',
      'Time': '01:15PM',
      'Headline': 'Former Amazon executive starts robotics software company',
    },
    {
      'No.': 24,
      'Date': '2022-11-24',
      'Time': '04:45PM',
      'Headline': 'Former Tesla executive joins autonomous delivery startup',
    },
    {
      'No.': 25,
      'Date': '2022-11-18',
      'Time': '09:30AM',
      'Headline':
        'Former Microsoft executive becomes COO of blockchain-based supply chain startup',
    },
    {
      'No.': 26,
      'Date': '2022-11-12',
      'Time': '11:30AM',
      'Headline': 'Former Facebook executive co-founds mental health app startup',
    },
    {
      'No.': 27,
      'Date': '2022-11-06',
      'Time': '02:00PM',
      'Headline':
        'Former Amazon and Google executives join forces to launch AI-powered retail startup',
    },
    {
      'No.': 28,
      'Date': '2022-11-01',
      'Time': '10:45AM',
      'Headline':
        'Former Tesla executive becomes CEO of electric vehicle charging startup',
    },
    {
      'No.': 29,
      'Date': '2022-10-27',
      'Time': '03:20PM',
      'Headline':
        'Former Microsoft and Google executives start cybersecurity consulting firm',
    },
    {
      'No.': 30,
      'Date': '2022-10-21',
      'Time': '08:00AM',
      'Headline':
        'Former Intel and IBM executives co-found quantum computing hardware startup',
    },
  ];
  return (
    <FeedWrapper>
      <TableWrapper>
        <br />
        <StyledHeader>Top Ranked News</StyledHeader>
        <table style={{ width: '100%' }}>
          <tbody>
            {headLine.map((item) => (
              <TrHeadline key={item.number} style={{ color: '#caad58' }}>
                <td style={{ padding: '.6rem' }}>{item.number}</td>
                <td style={{ padding: '.6rem', color: '#caad58' }}>{item.headline}</td>
                <td style={{ padding: '.6rem' }}>{item.date}</td>
                <td style={{ padding: '.6rem' }}>{item.time}</td>
              </TrHeadline>
            ))}
          </tbody>
        </table>
        <StyledHeader>Time Ordered News</StyledHeader>
        <table style={{ width: '100%' }}>
          <tbody>
            {news.map((item) => (
              <TrHeadline key={item['No.']}>
                <td style={{ padding: '0.60rem' }}>
                  {item['No.']}
                  {'           '}
                </td>
                <td style={{ padding: '0.45rem' }}>{item['Date']}</td>
                <td style={{ padding: '0.45rem' }}>{item['Time']}</td>
                <td style={{ padding: '0.45rem', color: '#df6620' }}>
                  {item['Headline']}
                </td>
              </TrHeadline>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </FeedWrapper>
  );
};

const FeedWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.body};
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  overflow-x: hidden;
`;
const TableWrapper = styled.table`
  margin-top: 1rem;
  width: 94%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-x: hidden;
`;
const TrHeadline = styled.tr`
  background: ${({ theme }) => theme.body};
`;
const EntryWrapper = styled.div`
  margin-top: 1rem;
  width: 100%;
  background: ${({ theme }) => theme.body};
  display: flex;
  align-items: center;
  gap: 2.5rem;
  overflow-x: hidden;
`;

const StyledHeader = styled.h2`
  color: white;
  font-size: 24px;
`;

export default Ticker;
