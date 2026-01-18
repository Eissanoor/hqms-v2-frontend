import React, { useState } from "react";
import SideNav from "../../components/Sidebar/SideNav";
import Patientsnumberchat from "./Patientsnumberchat";
import PrevouseJourney from "./prevouseJourney";
import DepartmentData from "./departmentData";
import EyeBall from "./eyeBall";
const Kpi = () => {

    return (
      <>
        <SideNav>
          <div className="min-h-screen bg-green-100 p-8 shadow-md">
            <div className="bg-white shadow-lg rounded-lg p-6">
             
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-primary rounded-md shadow-md">
                  <Patientsnumberchat />
                </div>
                
                <div className="bg-primary rounded-md shadow-md">
                  <DepartmentData />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <EyeBall />
                </div>
                <div className="bg-primary rounded-md shadow-md">
                  <PrevouseJourney />
                </div>
              </div>
            </div>
          </div>
        </SideNav>
      </>
    );
};

export default Kpi;
