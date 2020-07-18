import React from 'react'; 
import {configure, shallow} from 'enzyme'; 
import Adapter from 'enzyme-adapter-react-16'; 
import NavigationItems from './NavigationItems'; 
import NavigationItem from './NavigationItem/NavigationItem'; 

configure({adapter: new Adapter()});

describe('<NavigationItems/>', () => {
    let wrapper; 
    
    beforeEach(() => {
        wrapper = shallow(<NavigationItems/>); 
    });
    
    it('should render two <NavigationItem/> if not signed in', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    }); 

    it('should render three <NavigationItem/> elements if signed in', () => {
        wrapper.setProps({isAuthenticated: true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    }); 

    it('should contain sign out link if signed in', () => {
        wrapper.setProps({isAuthenticated: true});
        expect(wrapper.contains(<NavigationItem link = "/logout">Sign Out</NavigationItem>)).toEqual(true);
    }); 
});