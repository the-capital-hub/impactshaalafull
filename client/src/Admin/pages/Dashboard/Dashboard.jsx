import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/service";
import {
  NGOs,
  citizens,
  corporates,
  filter,
  institutes,
  project,
} from "../adminDashboard";
import {
  AdminSearch,
  LeftNavigation,
  MiniCollab,
  Stat,
} from "../../components";
import "./dashboard.scss";
import Filter from "../../components/Filter/Filter";
import { useOutletContext } from "react-router-dom";
import { Spin } from 'antd';

const Dashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [stat, setStat] = useState();
  const [collabs, setCollab] = useState([]);
  const [filterValues, setFilterValues] = useState({
    from: "",
    to: "",
    dateFilter: "",
    stakeholder: "",
  });
  const { setPageTitle } = useOutletContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("dashboard");
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      const getStat = async () => {
        try {
          const res = await axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL}/api/company/getstats`
          );
          setStat(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getStat();

      const getCollab = async () => {
        try {
          const res = await axiosInstance.get(
            `${import.meta.env.VITE_BASE_URL}/api/collaboration/getallcollab`,
            {
              params: filterValues,
            }
          );
          setCollab(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getCollab();
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

  }, [filterValues]);

  const handleFilterChange = (selectedFilters) => {
    setFilterValues((prevFilterValues) => ({
      ...prevFilterValues,
      ...selectedFilters,
    }));
  };

  const handleClearFilter = () => {
    setFilterValues({
      from: "",
      to: "",
      dateFilter: "",
      stakeholder: "",
    });
  };

  return (
    <div className="adminDashboard">
      {showFilter && (
        <Filter onCancel={setShowFilter} onFilterChange={handleFilterChange} />
      )}

      <AdminSearch />
      <div className="rightContainer">
        <div className="leftSide">
          <div className="stats">
            <p className="stakeholderTitle">No. of stakeholders</p>
            <div className="stakeholders">
              <Stat
                img={corporates}
                count={stat?.corporates}
                title={"Corporates"}
              />
              <Stat img={NGOs} count={stat?.ngos} title={"NGOs"} />
              <Stat
                img={institutes}
                count={stat?.educationalInstitutions}
                title={"Institutes"}
              />
              <Stat
                img={citizens}
                count={stat?.workingProfessional}
                title={"Citizens"}
              />
            </div>
          </div>

          <div className="collabContainer">
            <div className="titleForCollab">
              <h3>All Collaborations</h3>
              <div onClick={() => setShowFilter(true)} className="filter">
                <img src={filter} alt="" />
                <p>Filter</p>
              </div>
              <p onClick={handleClearFilter}>See all</p>
            </div>
            {collabs.map((collab) => (
              // eslint-disable-next-line react/jsx-key
              <div className="miniCollabContainer">
                {/* <MiniCollab page={"dashboard"} status={"In progress"} /> */}
                <MiniCollab
                  collabId={collab._id}
                  status={collab.completed}
                  page={"dashboard"}
                  fromId={collab.fromId}
                  toId={collab.toId}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rightSide">
          <div className="usersContainer">
            <p className="noOfUsers">No. of users</p>
            <Stat img={citizens} count={stat?.totalUsers} title={"Total"} />
          </div>
          <div className="usersContainer">
            <p className="noOfUsers">Total Projects</p>
            <Stat img={project} count={stat?.totalProjects} title={"Total"} />
          </div>
        </div>
      </div>
      <Spin spinning={loading} fullscreen />
    </div>
  );
};

export default Dashboard;
