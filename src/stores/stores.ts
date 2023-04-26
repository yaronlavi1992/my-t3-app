import { makeAutoObservable } from "mobx";
import { useContext } from "react";
import { MobXContext } from "./mobxProvider";

export class BuildingStore {
  floorClusters: any = [];
  isEditingBuilding = false;
  selectedParts: any = {};
  
  constructor() {
    this.setFloorClusters([
      { startFloor: 0, endFloor: 3, apartments: 8, description: 'residence' },
      { startFloor: 4, endFloor: 7, apartments: 6, description: 'offices' },
      { startFloor: 8, endFloor: 9, apartments: 20, description: 'offices' },
    ]);
    makeAutoObservable(this);
  }
  
  // make arrow functions otherwise it won't recognize 'this' keyword;

  setFloorClusters = (clusters: any) => {
    this.floorClusters = clusters;
  }

  setIsEditingBuilding = (isEditing: boolean) => {
    this.isEditingBuilding = isEditing;
  }

  setSelectedParts = (parts: any) => {
    this.selectedParts = parts;
  }

  clearSelection = () => {
    this.setSelectedParts({});
  }

}

export const useStore = () => useContext(MobXContext);