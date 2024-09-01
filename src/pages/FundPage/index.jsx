import React, { useState, useCallback, useEffect } from 'react';
import Feed from '../../components/Feed';
import Fund from '../../components/Fund';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import { useParams } from 'react-router-dom';
import ActivityLineGraph from './Activity';
import SectionHeader from '../../components/NavigationCard/SectionHeader';
import { Oval } from 'react-loader-spinner';

import { DealFlowComponent } from './DealFlowComponent';
import TimelineGraph, { SignalsAnalytics } from './graph_v1';
// import { SignalsAnalytics } from './graph';
import axios from 'axios';
import { GeneralErrorBoundary } from '../../UI/Errors/GeneralErrorBoundary';

const businessTags = [
  'Navigation',
  'OEM Focussed',
  'Other',
  'Parking',
  'Public Transportation',
  'Rail Transportation',
  'Range Extender',
  'Real Estate',
  'Recycling Technology',
  'Regulation',
  'Retail',
  'Ride Hailing',
  'Roadside Assistance',
  'Robotics',
  'Sensing',
  'Small & Medium Businesses',
  'Social Media',
  'Software',
  'Supply Chain',
];

const assignRandomBusinessTag = (projectData) => {
  projectData.timeline.forEach((item) => {
    const randomIndex = Math.floor(Math.random() * businessTags.length);
    item['businessTag'] = businessTags[randomIndex];
  });
  return projectData;
};

const projectDataRaw = {
  status: 'success',
  timeline: [
    {
      signal_date: '2023-03-10',
      fund: {
        uuid: '148579a5-d7ad-4a96-8dc6-e8c55f3b3e31',
        name: 'Third Sphere',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/ptiyijpd9eyb2i4uwhmu',
      },
    },
    {
      signal_date: '2023-04-04',
      fund: {
        uuid: '2ad567c2-62b3-473e-a63c-0b13d388525f',
        name: 'Powerhouse Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/y0nv94ktfueqg2qy5tk9',
      },
    },
    {
      signal_date: '2023-05-06',
      fund: {
        uuid: '74de3077-b724-4334-9ea4-91f27a9c7c08',
        name: 'BAM Ventures',
        logo: 'https://media.licdn.com/dms/image/C560BAQEl_pNH2LLOLg/company-logo_200_200/0/1550622015579?e=2147483647&v=beta&t=WM3NGVUMmjm44Y5P32P8fYPD1GwIvG--_J1o3XJcGi8',
      },
    },
    {
      signal_date: '2023-05-10',
      fund: {
        uuid: '3aa355fa-83fc-450a-bd49-37130709728e',
        name: 'Amplify Capital',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/v3ifqc5lslnesvckwa7c',
      },
    },
    {
      signal_date: '2023-05-17',
      fund: {
        uuid: '9654bed4-4e99-42ca-b363-bb516680b1bf',
        name: 'Lowercarbon Capital',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/hz0lxdt9d6jc4h98gjgt',
      },
    },
    {
      signal_date: '2023-05-17',
      fund: {
        uuid: '491eb007-8d63-4644-8cdf-a521278e3134',
        name: 'GM Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/kosmfc6xlimybcvc3wis',
      },
    },
    {
      signal_date: '2023-05-21',
      fund: {
        uuid: '377c866a-5a60-4e41-8058-794d2d25722e',
        name: 'Energy Impact Partners',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ngm5wuu6gjuburbidatw',
      },
    },
    {
      signal_date: '2023-06-09',
      fund: {
        uuid: 'aac561bc-f311-4956-9226-cbf3c013ae80',
        name: 'Urban Innovation Fund',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/v1493712873/yapp6n1uqdlat5gnd1o5.png',
      },
    },
    {
      signal_date: '2023-06-09',
      fund: {
        uuid: 'b6b897fd-5639-4cd5-b392-6402c67753b5',
        name: 'Contrarian Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1500582749/hkbkeibxlasngxjvg1mz.png',
      },
    },
    {
      signal_date: '2023-06-14',
      fund: {
        uuid: 'cc5b1e12-7495-4fab-a75a-28d93322b063',
        name: 'Climactic',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/tgap6hgxmlyywe0njzqj',
      },
    },
    {
      signal_date: '2023-06-14',
      fund: {
        uuid: 'ab98f5f7-ba49-428f-b1cd-556903c6bdab',
        name: 'Porsche Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/vszbbxg6s0wkevghi3r3',
      },
    },
    {
      signal_date: '2023-06-14',
      fund: {
        uuid: '2ad567c2-62b3-473e-a63c-0b13d388525f',
        name: 'Powerhouse Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/y0nv94ktfueqg2qy5tk9',
      },
    },
    {
      signal_date: '2023-06-20',
      fund: {
        uuid: '291a3aab-4fb5-48ff-a5c5-16ea24f8b8af',
        name: 'Lightspeed',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/czergf6pnxkmmpgmnik7',
      },
    },
    {
      signal_date: '2023-07-01',
      fund: {
        uuid: '541040a1-9b12-4f34-a1f5-b5c49cc4fe95',
        name: 'Bain Capital Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/jirvnawfkfh92ggroqrd',
      },
    },
    {
      signal_date: '2023-07-12',
      fund: {
        uuid: '377c866a-5a60-4e41-8058-794d2d25722e',
        name: 'Energy Impact Partners',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ngm5wuu6gjuburbidatw',
      },
    },
    {
      signal_date: '2023-07-12',
      fund: {
        uuid: '7cea180d-7560-4f83-ba49-6b29027d3458',
        name: 'Toyota Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/v1499857739/qyh006itvmepp86re9kv.jpg',
      },
    },
    {
      signal_date: '2023-07-14',
      fund: {
        uuid: '86d650ad-b145-4ef1-aefb-da8171ff6dea',
        name: 'Shell Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1488040409/mkz17efk4lbzqwtxoef8.png',
      },
    },
    {
      signal_date: '2023-07-25',
      fund: {
        uuid: '9654bed4-4e99-42ca-b363-bb516680b1bf',
        name: 'Lowercarbon Capital',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/hz0lxdt9d6jc4h98gjgt',
      },
    },
    {
      signal_date: '2023-08-01',
      fund: {
        uuid: '2484d47b-b54e-423c-8b91-d97ad58c2269',
        name: 'BP Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1488039292/yesmtc8tpggbkfvfakjj.png',
      },
    },
    {
      signal_date: '2023-08-02',
      fund: {
        uuid: '77b8a859-9fc8-4fc2-a0a4-f1da81e311b1',
        name: 'Fontinalis Partners',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/v1496420794/hbqwufhek7z1l1rqjst3.png',
      },
    },
    {
      signal_date: '2023-08-02',
      fund: {
        uuid: '377c866a-5a60-4e41-8058-794d2d25722e',
        name: 'Energy Impact Partners',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ngm5wuu6gjuburbidatw',
      },
    },
    {
      signal_date: '2023-08-10',
      fund: {
        uuid: '54e57f1c-0fdc-49d0-88e9-0e788ecf9570',
        name: 'Yamaha Motor Ventures',
        logo: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/tixxomgiedsur6eduazz',
      },
    },
    {
      signal_date: '2023-08-10',
      fund: {
        uuid: 'e984a01b-0c77-4592-bb7c-1092644c9e8a',
        name: 'Yamaha VC',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/tixxomgiedsur6eduazz',
      },
    },
    {
      signal_date: '2023-08-15',
      fund: {
        uuid: '541040a1-9b12-4f34-a1f5-b5c49cc4fe95',
        name: 'Bain Capital Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/jirvnawfkfh92ggroqrd',
      },
    },
    {
      signal_date: '2023-08-17',
      fund: {
        uuid: '2ad567c2-62b3-473e-a63c-0b13d388525f',
        name: 'Powerhouse Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/y0nv94ktfueqg2qy5tk9',
      },
    },
    {
      signal_date: '2023-09-01',
      fund: {
        uuid: '77b8a859-9fc8-4fc2-a0a4-f1da81e311b1',
        name: 'Fontinalis Partners',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/v1496420794/hbqwufhek7z1l1rqjst3.png',
      },
    },
    {
      signal_date: '2023-09-09',
      fund: {
        uuid: '868221df-40a0-4df4-8946-1ddfc3cfec05',
        name: 'HAX',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/vfoigdcszx8pz0mtckrg',
      },
    },
    {
      signal_date: '2023-09-19',
      fund: {
        uuid: 'a8b1194c-7596-44f8-8d61-f4c08cd78e12',
        name: 'Closed Loop Partners',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/kivyi9r9pgc294inrx3t',
      },
    },
    {
      signal_date: '2023-09-23',
      fund: {
        uuid: '5e6a6935-0553-4413-ab7e-ed2e696b3a2b',
        name: 'Enertech Capital',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/emyd9tfbbxjiuadqzlfl',
      },
    },
    {
      signal_date: '2023-09-23',
      fund: {
        uuid: '54e57f1c-0fdc-49d0-88e9-0e788ecf9570',
        name: 'Yamaha Motor Ventures',
        logo: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/tixxomgiedsur6eduazz',
      },
    },
    {
      signal_date: '2023-09-23',
      fund: {
        uuid: 'e984a01b-0c77-4592-bb7c-1092644c9e8a',
        name: 'Yamaha VC',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/tixxomgiedsur6eduazz',
      },
    },
    {
      signal_date: '2023-10-01',
      fund: {
        uuid: '624769b3-d5e0-4905-9dd5-36982128afae',
        name: 'Alumni Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/ppvipkp02d33auqnbzan',
      },
    },
  ],
};

const projectData = assignRandomBusinessTag(projectDataRaw);

const fundData = {
  project: {
    uuid: 'ce50a133-f35a-44b9-91b7-c64233ee8540',
    title: 'WarrCloud Inc.',
    about:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum turpis vitae vulputate lacinia. Suspendisse leo neque, sagittis eu porta a, euismod vel lectus. Bibendum turpis vitae vulputate.',
    markdown_description: null,
    verticals: ['Automotive Finance', 'Insurance'],
    keywords: null,
    funds: [
      {
        uuid: 'ab98f5f7-ba49-428f-b1cd-556903c6bdab',
        name: 'Porsche Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/vszbbxg6s0wkevghi3r3',
      },
      {
        uuid: 'b8a50afb-b78c-4edc-8850-f69c7cec3056',
        name: 'AutoTech Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1499878534/hijwai1c64hhcfpxmdnq.jpg',
      },
      {
        uuid: 'd75f4295-f535-4e76-8025-657f184ade2b',
        name: 'Proeza Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/ax0yhyvdwrrbdpzuuehp',
      },
      {
        uuid: '2ad567c2-62b3-473e-a63c-0b13d388525f',
        name: 'Powerhouse Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/y0nv94ktfueqg2qy5tk9',
      },
      {
        uuid: 'f3be14f4-0542-4d27-939d-50916feb9db2',
        name: 'Automotive Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/m7saq2yya5uckbzh8fvz',
      },
      {
        uuid: '5e6a6935-0553-4413-ab7e-ed2e696b3a2b',
        name: 'Enertech Capital',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/emyd9tfbbxjiuadqzlfl',
      },
      {
        uuid: 'f275f25d-8a42-4bd6-8cff-064227d6cc65',
        name: 'FM Capital',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_40,w_40,f_auto,b_white,q_auto:eco,dpr_1/mh5ew3bsnk7brnc25eyg',
      },
      {
        uuid: '86d650ad-b145-4ef1-aefb-da8171ff6dea',
        name: 'Shell Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1488040409/mkz17efk4lbzqwtxoef8.png',
      },
      {
        uuid: '8beb1cb9-49a6-4022-a556-a40526677784',
        name: 'Ibex Investors',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/quzvu5untacuhyfsqxfe',
      },
      {
        uuid: 'bfe8126d-00b1-4fc0-bc64-cdaef98137bc',
        name: 'Goodyear Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/ew5unm1noxzfrgmsined',
      },
      {
        uuid: 'c8aedb8a-7c28-4e0c-88fb-c76e1045960c',
        name: 'NextGear Ventures',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/wcer8dvby2udsvrywaz0',
      },
      {
        uuid: 'e67c5722-8fbd-45c2-aed7-0f1910af638b',
        name: 'Baloise',
        logo: 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/qyxxv1rofid7wyazwd1w',
      },
      {
        uuid: '251a054f-5d1d-4d45-adfe-59e2d8182ce8',
        name: 'Motiva Ventures',
        logo: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/dlcgxj4p2jmskjhvx4lw',
      },
    ],
    investor_interest: null,
    logo: 'https://media.licdn.com/dms/image/C560BAQHh4sMq4GbROA/company-logo_200_200/0/1621455645318?e=1703721600&v=beta&t=uoWJj8K3Ce_xlYf1e5WDuFUvZfZpeccUMGUKaBb56SM',
    website: 'http://www.warrcloud.com',
    tags: [
      {
        title: 'founded',
        content: '2017',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
      {
        title: 'location',
        content: 'Idaho, United States',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
      {
        title: 'team size',
        content: '68',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
      {
        title: 'stage',
        content: 'Seed',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
      {
        title: 'funding',
        content: '$900,000',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
      {
        title: 'last round',
        content: '31 March 2021',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
      {
        title: 'last round amount',
        content: '$900,000',
        icon: null,
        row: null,
        ordering: null,
        colour: null,
      },
    ],
    socials: [
      {
        title: 'crunchbase_url',
        url: 'https://www.crunchbase.com/organization/warrcloud',
        icon: 'crunchbase',
      },
      {
        title: 'linkedin_url',
        url: 'https://www.linkedin.com/company/warrcloud-inc',
        icon: 'linkedin',
      },
    ],
    financials: null,
  },
  project_user_info: {
    project_id: 'ce50a133-f35a-44b9-91b7-c64233ee8540',
    username: 'BobDaglian',
    time_recommended: '2023-09-28T11:58:28.910998+00:00',
    archived: true,
    favourite: false,
    rating: null,
    feedback: null,
    feedback_posted: null,
  },
  comments: [
    {
      user: 'BrandonProetto',
      feedback: null,
      feedback_time: null,
      rating: null,
    },
    {
      user: 'BobDaglian',
      feedback: null,
      feedback_time: null,
      rating: null,
    },
    {
      user: 'EthanCohen',
      feedback: null,
      feedback_time: null,
      rating: null,
    },
    {
      user: 'BrettWatson',
      feedback: null,
      feedback_time: null,
      rating: null,
    },
  ],
};

const FundPage = () => {
  const theme = useTheme();
  const [fund, setFund] = useState();
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const { error, userInfo, access_token } = useSelector((state) => state.user);

  const additionalOffset = 50; // Define how much further you want to scroll

  useEffect(() => {
    // Hash logic here
    const hash = window.location.hash.substring(1); // Remove '#'

    if (hash) {
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });

        // Scroll a bit further down
        window.setTimeout(() => {
          // Timeout to ensure 'scrollIntoView' finishes
          window.scrollBy(0, additionalOffset);
        }, 1000); // Adjust time as needed

        // Remove the hash from the URL
      }
    }
  }, []);

  const getFund = useCallback(async () => {
    if (access_token) {
      setLoading(true);
      try {
        // get user data from store
        // configure authorization header with user's token
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(`/v1/fund/${params.id}`, config);
        setFund(data);
        return data;
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }, [params.id, access_token]);

  useEffect(() => {
    getFund();
  }, []);

  return (
    <FeedWrapper>
      <Wrapper>
        <FundAbout>
          {!loading ? (
            <Fund
              key={params.id}
              uuid={params.id}
              info={fund}
              // newSignal={showResurfacing}
              title={fund?.name}
              project_user_info={fundData?.project_user_info}
              verticals={fund?.verticals ?? ''}
              logo={fund?.logo}
              // investor={fund}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Oval
                height={70}
                width={70}
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
          )}
        </FundAbout>
        <NetworkAnalysis>
          {/* <h2 style={{ marginLeft: '0.5rem', marginBottom: '1.6rem' }}>Intent Signals</h2> */}
          <SectionHeader
            headerText='Intent Signals'
            description={
              'Gain comprehensive insights by tracking tagged signals over time.'
            }
          />
          <NetworkWrapper>
            <GeneralErrorBoundary
              customMessage={`Cannot load activity graph ${
                fund?.name ? 'for' + ' ' + fund?.name : ''
              }`}
            >
              <TimelineGraph
                uuid={params.id}
                access_token={access_token}
                fundName={fund?.name}
              />
            </GeneralErrorBoundary>
            {/* <SignalsAnalytics
              uuid={params.id}
              access_token={access_token}
              data={projectData.timeline}
            /> */}
          </NetworkWrapper>
        </NetworkAnalysis>
        <DealFlow id='deal-flow'>
          {/* <SectionHeader
            headerText='Deal Flow'
            description={`Access the fund's deal flow to reveal hidden investment opportunities.`}
          /> */}

          {/* <h2 style={{ marginLeft: '0.5rem', zIndex: 99999, marginBottom: '1.5rem' }}>
            Deal Flow
          </h2> */}
          {!loading && (
            <DealFlowComponent
              uuid={fund.uuid}
              showBanner={false}
              width={100}
            />
          )}
        </DealFlow>
      </Wrapper>
    </FeedWrapper>
  );
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.body};
  max-width: 95%;
  min-width: 97%;
  display: flex;
  margin-top: 0.2rem;
  flex-direction: column;
  padding-right: 0.65rem;
  gap: 1rem;
  overflow-y: auto;
  min-height: 50vh;
  margin-bottom: 5rem;
  padding-bottom: 2.5rem;
`;

const NetworkAnalysis = styled.div`
  /* padding: 1rem; */
  /* min-height: 600px;
  display: flex;
  justify-content: center; */
  border-radius: 5px;
`;
const NetworkWrapper = styled.div`
  background: ${({ theme }) => theme.background};
  padding: 1rem;
  min-height: 450px;
  display: flex;
  justify-content: center;
  border-radius: 6px;
`;
const FundAbout = styled.div`
  /* margin-right: 1rem; */
`;
const KeyMetrics = styled.div``;
const DealFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0rem;
  height: 88vh;
  width: 100%;
  margin-bottom: 1rem;
`;

const FeedWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.body};
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-height: 100vh;
  align-items: center;
  gap: 0.1rem;
  overflow-x: hidden;
`;

export default FundPage;
