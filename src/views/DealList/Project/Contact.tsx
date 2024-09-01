// @ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import ContactCard from '../../../UI/ContactCard';
import axios from 'axios';
import styled, { useTheme } from 'styled-components';
import { Oval } from 'react-loader-spinner';

interface ContactInterface {
  uuid: string;
  access_token: string;
  userInfo: unknown;
  company: string;
}

// {
//   "works_in_company": null,
//   "img": null,
//   "name": null,
//   "position": null,
//   "email": null,
//   "linkedin": "https://www.linkedin.com/in/sarahmarie-rust/"
// }

const Contact = ({ uuid, access_token, userInfo, company }: ContactInterface) => {
  const theme = useTheme();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getFeedback = useCallback(async () => {
    if (access_token) {
      try {
        // get user data from store
        // configure authorization header with user's token
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.get(`/v1/projects/${uuid}/actions/contact/`, config);
        setContacts(data.contacts);
        setLoading(false);
        return data;
      } catch (error: any) {
        setError(!error);
        setLoading(false);
        console.log(error);
      }
    }
  }, [access_token, uuid]);

  useEffect(() => {
    getFeedback();
  }, [getFeedback]);

  return (
    <ContactSectionWrapper>
      {!error && !loading && contacts.length > 0 && <h5>{company} Associates</h5>}
      <CardsWrapper>
        {/* <ContactCard name={'anton matskevich'}, company={'crispify'}, role={'CEO'}, email={'crispify@gmail.com'}, recommended={true} /> */}

        {!loading ? (
          !error ? (
            contacts.length > 0 ? (
              contacts?.map((contact) => {
                return (
                  <ContactCard
                    name={contact.name}
                    role={contact.position}
                    email={contact.email}
                    recommended={contact.recommended}
                    company={company}
                    linkedIn={contact.linkedin}
                    photo={contact.img}
                    userInfo={userInfo}
                  />
                );
              })
            ) : (
              <h5>Contacts are not currently available for this project</h5>
            )
          ) : (
            <h5>Something went wrong</h5>
          )
        ) : (
          <Oval
            height={60}
            width={60}
            color='#484848'
            wrapperStyle={{}}
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#222222'
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
      </CardsWrapper>
    </ContactSectionWrapper>
  );
};

const ContactSectionWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const CardsWrapper = styled.div`
  width: 100%;
  /* background: #5f5fec; */
  display: flex;
  overflow-x: auto;
  gap: 1rem;
`;

export default Contact;
