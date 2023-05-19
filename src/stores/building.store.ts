import { makeAutoObservable } from "mobx";
import { useContext } from "react";
import { MobXContext } from "./mobxProvider";

export class BuildingStore {
  floors: any = [];
  isEditingBuilding = false;
  showModal = false;

  constructor() {
    makeAutoObservable(this);
  }

  // make arrow functions otherwise it won't recognize 'this' keyword;

  setFloors = (floors: any[]) => {
    this.floors = floors;
  }

  setIsEditingBuilding = (isEditing: boolean) => {
    this.isEditingBuilding = isEditing;
  }

  setShowModal = (show: boolean) => {
    this.showModal = show;
  }

  clearSelection = () => {
    const updatedFloors = this.floors.map((floor: any) => ({
      ...floor,
      apartments: floor.apartments.map((apartment: any) => ({
        ...apartment,
        isSelected: false
      }))
    }));
    this.setFloors(updatedFloors);
  };
  

  get selectedApartments() {
    return this.floors.reduce((acc: any, floor: any, index: number) => {
      const selectedApartments = floor.apartments
        .filter((apartment: any) => apartment.isSelected)
        .reduce((apartmentAcc: any, apartment: any) => {
          return { ...apartmentAcc, [apartment.apartmentIndex]: apartment };
        }, {});
  
      if (Object.keys(selectedApartments).length > 0) {
        return { ...acc, [index]: selectedApartments };
      }
  
      return acc;
    }, {});
  }
  


}

export const useStore = () => useContext(MobXContext);