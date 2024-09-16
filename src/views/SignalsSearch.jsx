import {
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { companiesOptions } from "./defaultOptions"; // Make sure to import your default options correctly
import AsyncSelect from "react-select/async";
import TimelineGraph from "../views/DealList/Project/TimelineGraph"; // Import your TimelineGraph component
import TimeLine from "../views/DealList/Project//TimeLine"; // Import your TimelineGraph component
import styled, { useTheme } from "styled-components";
// import { Button } from "antd";
import { Oval } from "react-loader-spinner";
import { Card } from "antd";
// import Project from "../components/Project";
import { useSearch } from "../hooks/UrlSearchContext";
import { useSearchProjects } from "../hooks/useSearch";

const SignalsSearch = () => {
  const theme = useTheme();
  const [] = useState({
    project: [],
  });
  // const [loading, setLoading] = useState(false);
  const { loading, setLoading } = useSearch();

  const [setIsButtonClicked] = useState(false); // New state

  const [projectData, setProjectData] = useState(null);
  const { searchResults } = useSearch();

  const [companiesOption, setCompaniesOption] = useState({});
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const { access_token } = useSelector((state) => state.user);

  const [] = useSearchProjects();

  const [] = {
    singleValue: (provided) => ({
      ...provided,

      flexGrow: 1,
      border: "none",
      color: theme.text,
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? "orange"
          : isFocused
          ? "#db6f56"
          : undefined,
      };
    },
    control: (provided) => ({
      ...provided,
      width: "100%",
      color: "red !important",
      fontSize: "14px",
      flexGrow: 1,
      border: `1px solid ${theme.borderColor}`,

      background: theme.background,

      borderColor: theme.borderColor,
    }),
    input: (provided) => ({
      ...provided,
      flexGrow: 1,
      border: "none",
      color: theme.text,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,

      background: theme.subBackground,

      color: theme.text,
      // height: '13px',
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "5x",
      marginBottom: "0px",

      fontSize: "12px",

      background: theme.body,

      border: `1px solid ${theme.borderColor}`,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
  };

  const getTimeline = useCallback(
    async (uuid) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        const { data } = await axios.post(
          `/v1/projects/${uuid}/timeline?detailed=false`,
          null,
          config
        );
        // Do something with the data
      } catch (error) {
        console.error("Error fetching timeline", error);
      } finally {
        // Fake loading time
        setTimeout(() => {
          setLoading(false); // End fake loading after 3 seconds
        }, 3000);
      }
    },
    [access_token, projectData]
  );

  const handleButtonClick = () => {
    if (companiesOption && companiesOption.id) {
      // Reset states for new search
      setIsButtonClicked(false);
      setProjectData(null);

      // Fetch new data
      getTimeline(companiesOption.id);

      // Update the button click state and start loading
      setIsButtonClicked(true);
      setLoading(true);

      // Fake loading time
      setTimeout(() => {
        setLoading(false); // End fake loading after 3 seconds
      }, 3000);
    }
  };

  useEffect(() => {
    handleButtonClick();
    setCompaniesOption(searchResults[0] ?? {});
    getTimeline(searchResults[0]?.uuid ?? "");
    handleButtonClick();
  }, [searchResults]);

  const handleChangeCompany = (selectedOption) => {
    setCompaniesOption(selectedOption);
    setIsButtonEnabled(true);
    // setIsButtonClicked(true);
    isButtonEnabled && setLoading(true);
    isButtonEnabled && getTimeline(companiesOption.id);
  };

  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          gap: "1.2rem",
          width: "55%",
          bottom: "100rem",
          flexDirection: "column",
          justifyContent: "center",
          transform: isButtonEnabled && !loading ? "scale(0.8)" : "scale(0.8)",
          transition: "all 0.3s linear",
          // marginTop: !isButtonClicked && !loading ? '8rem' : '-2rem',
        }}
      >
        {/* <h1
          style={{
            fontFamily: 'Times New Roman',
            textAlign: 'center',
            fontSize: '3.2rem',
          }}
        >
          TwoTensor
        </h1> */}
        {/* <StyledAsyncSelect
          placeholder='Search For Project Signals ...'
          cacheOptions
          onChange={handleChangeCompany}
          loadOptions={debouncedLoadSuggestions}
          styles={customStylesSingle}
          noOptionsMessage={() => null}
          sx={{
            background: theme.subBackground,
          }}></StyledAsyncSelect>
        <div style={{ display: 'flex', alignSelf: 'center', gap: '1rem' }}>
          <Button
            disabled={!isButtonEnabled}
            onClick={handleButtonClick}
            style={{
              borderColor: theme.borderColor,
              width: '8rem',
              fontWeight: 'bold',
              background: !isButtonEnabled
                ? theme.subBackground
                : theme.background,
              color: !isButtonEnabled ? theme.borderColor : '#7b7b7b',
            }}>
            Find Signals
          </Button>
        </div> */}
        {loading && (
          <Oval
            height={60}
            width={60}
            color="#484848"
            wrapperStyle={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#222222"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minHeight: "30rem",
          }}
        >
          {true && (
            <>
              <Card
                title={
                  <div style={{ color: theme.text }}>
                    {companiesOption.title} Description
                  </div>
                }
                bordered={false}
                style={{
                  width: "100%",
                  height: "15rem",
                  maxHeight: "100%",
                  overflow: "auto",
                  // paddingBottom: '4rem',
                  background: theme.background,
                  color: theme.text,
                }}
              >
                <div
                  style={{ height: "100%", width: "100%", overflowY: "auto" }}
                >
                  <p style={{ marginBottom: "0.4rem" }}>
                    {companiesOption.description ?? "No description available"}
                  </p>
                  {companiesOption.website && (
                    <a
                      href={companiesOption.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </Card>
              <Card
                title={
                  <span style={{ color: theme.text }}>Timeline Graph</span>
                }
                bordered={false}
                style={{
                  minWidth: "30rem",
                  height: "15rem",
                  width: "100%",
                  paddinBottom: "4rem",
                  background: theme.background,
                  color: theme.text,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "60%",
                    width: "95%",
                    bottom: "1.2rem",
                    right: "0.3rem",
                    position: "absolute",
                  }}
                >
                  <TimelineGraph
                    uuid={companiesOption.uuid}
                    access_token={access_token}
                  />
                </div>
              </Card>
              <Card
                title={<span style={{ color: theme.text }}>Timeline</span>}
                bordered={false}
                style={{
                  minWidth: "30rem",
                  height: "15rem",
                  width: "100%",
                  background: theme.background,
                  color: theme.text,
                }}
              >
                <TimeLine
                  uuid={companiesOption.uuid}
                  access_token={access_token}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const StyledAsyncSelect = styled(AsyncSelect)`
  flex-grow: 1;
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  background: ${({ theme }) => theme.body};
  display: flex;
  align-items: center;
  flex-direction: column;
  transition: all 0.3s linear;
`;

export default SignalsSearch;
