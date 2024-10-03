import React, { useEffect, useState } from 'react';
import imageConfig from '../config/imageConfig';
import { useNavigate } from 'react-router-dom';

const TypeForm = () => {
    const navigate = useNavigate();

    const [selectedFeature, setSelectedFeature] = useState('brand');
    const [isTransitioning, setIsTransitioning] = useState(false); // For handling the transition state
    const [categories, setCategories] = useState([])
    const [visibility, setVisibility] = useState('fixed')
    const [searchParams, setSearchParams] = useState(null)

    const featured = {
        'brand': {
            next: 'finish',
            items: [
                {
                    id: 20,
                    english: 'Altamode',
                    arabic: 'التمودة',
                    image_url: imageConfig.brands.altamode,
                    next: 'finish'
                },
                {
                    id: 20,
                    english: 'Ratti',
                    arabic: 'راتي',
                    image_url: imageConfig.brands.ratti,
                    next: 'finish'
                },
                {
                    id: 19,
                    english: 'English',
                    arabic: 'إنجليش',
                    image_url: imageConfig.brands.altamode,
                    next: 'finish'
                },
                {
                    id: 18,
                    english: 'Switzerland',
                    arabic: 'ايطالي',
                    image_url: imageConfig.brands.italian,
                    next: 'finish'
                },
                {
                    id: 18,
                    english: 'Sahra',
                    arabic: 'ايطالي',
                    image_url: imageConfig.brands.italian,
                    next: 'width'
                },
                {
                    id: 18,
                    english: 'Other',
                    arabic: 'ايطالي',
                    image_url: imageConfig.brands.italian,
                    next: 'width'
                }
            ]
        },
        'width': {
            next: null,
            items: [
                {
                    id: 23,
                    english: 'Rabit',
                    arabic: 'التمودة',
                    image_url: imageConfig.width.rabit,
                    next: null
                },
                {
                    id: 24,
                    english: 'Kamel',
                    arabic: 'راتي',
                    image_url: imageConfig.width.kamel,
                    next: null
                }
            ]
        },
        'finish': {
            next: 'width',
            items: [
                {
                    id: 21,
                    english: 'Lame',
                    arabic: 'التمودة',
                    image_url: imageConfig.finish.lame,
                    next: 'width'
                },
                {
                    id: 22,
                    english: 'Normal',
                    arabic: 'راتي',
                    image_url: imageConfig.finish.normal,
                    next: 'width'
                }
            ]
        }
    };

    useEffect(() => {
        const queryParams = categories.join(',');
        setSearchParams(queryParams);
    }, [categories]);

    const featuredItemClick = (feature, next) => {
        const updatedCategories = [...categories, feature.id];

        if (feature.next === null) {
            const queryParams = updatedCategories.join(','); // Use the updated array
            navigate(`/products/search?categoryIds=${queryParams}`);
        } else {
            setCategories(updatedCategories); // Update the state after navigation if there's more to select
            setIsTransitioning(true); // Start transition
            setTimeout(() => {
                setSelectedFeature(feature.next);
                setIsTransitioning(false); // End transition
            }, 300); // Timeout matches the CSS transition duration
        }
    };

    return (
        <main className={`w-full h-screen ${visibility} z-[100] items-center flex`}
            // onClick={() => setVisibility('hidden')}
        >
            <div className='absolute inset-0 bg-black opacity-50'></div>

            <div className='type-container w-[90%] h-[80vh] z-[150] bg-white m-auto rounded-[15px]'>
                <h1 className={`text-[35px] font-medium transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    Choose {selectedFeature.charAt(0).toUpperCase() + selectedFeature.slice(1)}
                </h1>
                <div
                    className={`grid ${
                        selectedFeature === 'brand' 
                        ? 'grid-cols-2 sm:grid-cols-3' // Set different column layout for 'brand'
                        : 'grid-cols-1 sm:grid-cols-2' // Default layout for other features
                    } flex-col sm:flex-row h-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                >                    {featured[selectedFeature]?.items.map((brand, index) => (
                        <button
                            key={index}
                            className={`relative flex items-center justify-center bg-gray-200 overflow-hidden hover:cursor-pointer group
                                w-full sm:w-[${100 / featured[selectedFeature].items.length}%] h-[${100 / featured[selectedFeature].items.length}%] sm:h-full`}
                            onClick={() => featuredItemClick(brand, featured[selectedFeature].next)}    
                        >
                            <img
                                src={brand.image_url}
                                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[120%]"
                                alt={`${brand.english} | ${brand.arabic}`}
                                style={{ objectPosition: 'center' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 backdrop-blur-[0] to-transparent z-2"></div>
                            <h1 className="text-white text-[18px] md:text-[25px] lg:text-[35px] font-bold text-center absolute bottom-5 z-10">
                                {brand.english} | {brand.arabic}
                            </h1>
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default TypeForm;
